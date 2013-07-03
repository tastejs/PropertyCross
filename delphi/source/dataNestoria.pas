//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit dataNestoria;

interface

uses
  System.SysUtils, System.Classes,
  Data.DB, Datasnap.DBClient, Generics.Collections, Fmx.Bind.GenData,
  Data.Bind.GenData, Data.Bind.Components, Data.Bind.ObjectScope,
  FMX.Objects, FMX.Types, FMX.ListBox, unitNestoriaObjects,
  unitNestoriaSearchTypes, unitNestoriaImagesServices;

type
  TdtmdlNestoria = class(TDataModule)
    cdsSearches: TClientDataSet;
    cdsSearchesLOCATION: TStringField;
    cdsSearchesID: TStringField;
    cdsAmbiguousSearchs: TClientDataSet;
    cdsAmbiguousSearchsLOCATION: TStringField;
    cdsAmbiguousSearchsID: TStringField;
    cdsFavourates: TClientDataSet;
    cdsFavouratesPrice: TStringField;
    cdsFavouratesTitle: TStringField;
    cdsFavouratesThumbImage: TGraphicField;
    cdsFavouratesGUID: TStringField;
    cdsFavouratesBedrooms: TStringField;
    cdsFavouratesBathrooms: TStringField;
    cdsFavouratesSummary: TStringField;
    cdsFavouratesThumbURL: TStringField;
    cdsFavouratesImageURL: TStringField;
    cdsFavouratesImage: TGraphicField;
    cdsSearchesLatitude: TFloatField;
    cdsSearchesLongitude: TFloatField;
    cdsSearchesSEARCH_DATE_TIME: TDateTimeField;
    pbsSearchResults: TPrototypeBindSource;
    cdsFavouratesDetailTitle: TStringField;
    procedure DataModuleCreate(Sender: TObject);
    procedure pbsSearchResultsCreateAdapter(Sender: TObject;
      var ABindSourceAdapter: TBindSourceAdapter);
  public type
    TLoadImageEvent = procedure(const Sender: TObject; AIndex: Integer) of object;
  strict private
    { Private declarations }
    procedure AsynchInternalSearch(const SearchURL : string; Page : Integer;
      LCallback: TProc<TNestoriaSearchResult>);
    function SynchInternalSearch(const SearchURL : string; Page : Integer): TNestoriaSearchResult;
    procedure InternalSearch(const SearchURL: string; Page : Integer;
      Synchronous: Boolean; LCallback: TProc<TNestoriaSearchResult>);
    function RecordSearchLocation(const LocationName, LocationID : string; const Lat, Long : Double): Boolean;
  public
    LastSearchConfig : TNestoriaLastSearchConfig;
    PropertyResultList : TList<TNestoriaProperty>;
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function CurrentProperty : TNestoriaProperty;
    { Public declarations }

    // Search for property from text
    function FetchPropertyByGUID(const GUID : string): Boolean;

    ///	<remarks>
    ///	  Searches for a property based on the location name passed. When used
    ///	  with the recent searches, it will identify the appropriate method
    ///	  call for previously resolved latitude longitude searches and
    ///	  ambigious searches.
    ///	</remarks>
    procedure FindProperties(const LocationName : string; ACallback: TProc<TNestoriaSearchResult>);

    ///	<remarks>
    ///	  Searches for properties based on the location passed.
    ///	</remarks>
    procedure FindPropertiesByLocation(const LocationLat, LocationLong : Double;
      ACallback: TProc<TNestoriaSearchResult>);

    ///	<remarks>
    ///	  Loads the next page of the current search.
    ///	</remarks>
    procedure LoadNextPage(ACallback: TProc<TNestoriaSearchResult>);

    procedure SetPropertyFavourateState(FavState : Boolean; GUID : string);

  end;

var
  dtmdlNestoria: TdtmdlNestoria;

implementation

{%CLASSGROUP 'FMX.Controls.TControl'}

{$R *.dfm}

uses unitNestoriaDBServices, unitNestoriaHTTPServices, unitNestoriaJSONServices,
  unitNestoriaThreadServices, FMX.Forms;

constructor TdtmdlNestoria.Create(AOwner: TComponent);
begin
  PropertyResultList := TObjectList<TNestoriaProperty>.Create;
  inherited;
end;

function TdtmdlNestoria.CurrentProperty: TNestoriaProperty;
begin
  if dtmdlNestoria.PropertyResultList.Count > 0 then
    Result := dtmdlNestoria.PropertyResultList.Items[dtmdlNestoria.pbsSearchResults.ItemIndex]
  else
    Result := nil;
end;

procedure TdtmdlNestoria.DataModuleCreate(Sender: TObject);
begin
  {$IFDEF IOS}
  cdsSearches.FileName := GetHomePath + PathDelim + 'Documents' + PathDelim + 'Searchs.xml';
  cdsFavourates.FileName := GetHomePath + PathDelim + 'Documents' + PathDelim + 'Favs.xml';
  {$ELSE}
  cdsSearches.FileName := 'Searchs.xml';
  cdsFavourates.FileName := 'Favs.xml';
  {$ENDIF}

  // Setup Search Results
  if FileExists(cdsSearches.FileName) then begin
    try
      cdsSearches.Open;
    except
    end;
  end;
  if cdsSearches.Active = False then
    cdsSearches.CreateDataSet;

  // Setup Favourates - Going to keep opening and closing so they are not in memory unless needed.
  if FileExists(cdsFavourates.FileName) then begin
    try
      cdsFavourates.Open;
    except
    end;
  end;
  if cdsFavourates.Active = False then begin
    cdsFavourates.CreateDataSet;
    cdsFavourates.SaveToFile;
  end;

end;

destructor TdtmdlNestoria.Destroy;
begin
  TNestoriaThreadServices.WaitForAllThreads; // Terminate.  Search thread references this object.
  PropertyResultList.Free;
  inherited;
end;

function TdtmdlNestoria.FetchPropertyByGUID(
  const GUID: string): Boolean;
const
  GUIDSearchURL = 'http://api.nestoria.co.uk/api?country=uk&action=search_listings&encoding=json&guid=%s';
var
  NewSearchURL : string;
  Prop: TNestoriaProperty;
begin
  Result := cdsFavourates.Locate('GUID',GUID,[]);

  if Result then begin
    PropertyResultList.Clear;
    Prop := TNestoriaDBServices.LoadProperty(cdsFavourates);
    PropertyResultList.Add(Prop);
    dtmdlNestoria.pbsSearchResults.Active := False;
    dtmdlNestoria.pbsSearchResults.ItemIndex := 0;
    dtmdlNestoria.pbsSearchResults.Active := True;
  end else begin
    // Should never hit this, but as I'd done this in testing, here incase of future use.
    // http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=51.684183,-3.431481
    NewSearchURL := Format(GUIDSearchURL,[GUID]);
    Result := SynchInternalSearch(NewSearchURL,1).Result = TNestoriaSearchResultType.nrtOK;
  end;
end;

procedure TdtmdlNestoria.FindPropertiesByLocation(const LocationLat, LocationLong : Double;
  ACallback: TProc<TNestoriaSearchResult>);
const
  // <p> for Page used in Internal Search
  GeoSearchURL = 'http://api.nestoria.co.uk/api?country=uk&action=search_listings&encoding=json&listing_type=buy&page=<p>&centre_point=%s,%s';
var
  NewSearchURL : string;
begin
  // Example
  // http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=51.684183,-3.431481
  NewSearchURL := Format(GeoSearchURL,[FloatToStr(LocationLat),FloatToStr(LocationLong)]);
  // Search
  AsynchInternalSearch(NewSearchURL,1,
    procedure(AResult: TNestoriaSearchResult)
    begin
      if AResult.Result = nrtOK then      // Put this into Internal Search?? What happens if Location is used how is that stored?
        RecordSearchLocation(FormatFloat('0.00',LocationLat)+', '+FormatFloat('0.00',LocationLong), '', LocationLat, LocationLong);
      ACallback(AResult);
    end);
end;

procedure TdtmdlNestoria.AsynchInternalSearch(const SearchURL: string; Page : Integer;
  LCallback: TProc<TNestoriaSearchResult>);
begin
  InternalSearch(SearchURL, Page, False, // Don't block
    LCallback);
end;

function TdtmdlNestoria.SynchInternalSearch(const SearchURL: string; Page : Integer): TNestoriaSearchResult;
var
  LResult: TNestoriaSearchResult;
begin
  InternalSearch(SearchURL, Page, True,  // Block
    procedure(AResult: TNestoriaSearchResult)
    begin
      LResult := AResult;
    end);
  Result := LResult;
end;

type
  /// <remarks>
  ///   TSearchDataLoaderThread can be used to fetch XML or JSON from the search URL
  /// </remarks>
  TSearchDataLoaderThread = class(TThread)
  private
    FOwner: TdtmdlNestoria;
    FSearchURL: string;
    FPage: integer;
    FCallback: TProc<TNestoriaSearchResult>;
  protected
    procedure Execute; override;
  public
    constructor Create(AOwner: TdtmdlNestoria;
      const SearchURL: string; Page : Integer;
      ACallback: TProc<TNestoriaSearchResult>);
  end;

procedure TdtmdlNestoria.InternalSearch(const SearchURL: string; Page : Integer;
  Synchronous: Boolean; LCallback: TProc<TNestoriaSearchResult>);
var
  LThread: TSearchDataLoaderThread;
begin
  // Get the data
  if Page <= 1 then begin
    TNestoriaThreadServices.CancelWorkInProgress; // Stop what we can
    PropertyResultList.Clear;
    LastSearchConfig.Reset(SearchURL);
  end;

  if Synchronous then
  begin
    LThread := TSearchDataLoaderThread.Create(Self,
      SearchURL, Page, LCallback);
    LThread.Execute;
    LThread.Free;
  end
  else
  begin
    LThread := TSearchDataLoaderThread.Create(Self,
      SearchURL, Page, LCallback);
    TNestoriaThreadServices.AddThread(LThread);
    LThread.Start;
  end;
end;


procedure TdtmdlNestoria.LoadNextPage(ACallback: TProc<TNestoriaSearchResult>);
begin
  AsynchInternalSearch(LastSearchConfig.BaseURL,LastSearchConfig.CurrentPage+1,
    ACallback);
end;

procedure TdtmdlNestoria.pbsSearchResultsCreateAdapter(Sender: TObject;
  var ABindSourceAdapter: TBindSourceAdapter);
begin
  Assert(PropertyResultList <> nil);
  if PropertyResultList <> nil then
    ABindSourceAdapter := TListBindSourceAdapter<TNestoriaProperty>.Create(Self,PropertyResultList,False);
end;

function TdtmdlNestoria.RecordSearchLocation(const LocationName, LocationID : string; const Lat, Long : Double): Boolean;
const
  MaxLocations = 4;
begin
  Result := True;
  try
    // If in the list then remove it.
    if cdsSearches.Locate('Location',LocationName,[loCaseInsensitive]) then
      cdsSearches.Delete;

    while cdsSearches.RecordCount >= MaxLocations do begin
      cdsSearches.Last;
      cdsSearches.Delete;
    end;

    cdsSearches.First;
    cdsSearches.Insert;
    cdsSearches.FieldByName('Location').AsString := LocationName;
    cdsSearches.FieldByName('ID').AsString := LocationID;
    cdsSearches.FieldByName('Latitude').AsFloat := Lat;
    cdsSearches.FieldByName('Longitude').AsFloat := Long;
    cdsSearches.FieldByName('SEARCH_DATE_TIME').AsDateTime := Now;
    cdsSearches.Post;

    cdsSearches.SaveToFile();
  except
    Result := False;
  end;
end;

procedure TdtmdlNestoria.FindProperties(const LocationName: string; ACallback: TProc<TNestoriaSearchResult>);
const
  // <p> for Page in internal Search
  BaseLocationSearchURL = 'http://api.nestoria.co.uk/api?country=uk&action=search_listings&encoding=json&listing_type=buy&page=<p>&place_name=%s';
var
  NewSearchURL, LocationID : string;
begin
  // Each Search location has a Name and also an ID if it is from Ambigious list. Otherwise the name is the ID
  if cdsAmbiguousSearchs.Active and (cdsAmbiguousSearchs.Locate('Location',LocationName,[loCaseInsensitive])) then
    LocationID := cdsAmbiguousSearchsID.AsString
  else if cdsSearches.Active and cdsSearches.Locate('Location',LocationName,[loCaseInsensitive]) then begin
    if (cdsSearches.FieldByName('Latitude').AsFloat = 0) and
       (cdsSearches.FieldByName('Longitude').AsFloat = 0) then begin
      LocationID := cdsSearches.FieldByName('ID').AsString;
    end else begin
      // Asynch call
      FindPropertiesByLocation(cdsSearches.FieldByName('Latitude').AsFloat, cdsSearches.FieldByName('Longitude').AsFloat,
        ACallback);
      Exit;
    end;
  end;

  if LocationID = '' then
    LocationID := LocationName;

  // Example
  // http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds
  NewSearchURL := Format(BaseLocationSearchURL,[LocationID]);

  // Search
  AsynchInternalSearch(NewSearchURL,1,
    procedure(AResult: TNestoriaSearchResult)
    begin
      if (AResult <> nil) and (AResult.Result = nrtOK) then     // Put this into Internal Search?? What happens if Location is used how is that stored?
        RecordSearchLocation(LocationName, LocationID,0,0);
      ACallback(AResult);
    end);

end;

procedure TdtmdlNestoria.SetPropertyFavourateState(FavState: Boolean; GUID : string);
var
  Prop : TNestoriaProperty;
begin
  if not cdsFavourates.Active then
    cdsFavourates.Open;

  if FavState = False then begin
    if cdsFavourates.Locate('GUID',GUID,[]) then
      cdsFavourates.Delete;
  end else begin
    // Should always be, but should add some find code here...
    if CurrentProperty.GUID = GUID then begin
      Prop := CurrentProperty;

      cdsFavourates.DisableControls;
      try
        cdsFavourates.Last;
        cdsFavourates.Insert;
        cdsFavouratesGUID.AsString := Prop.GUID;
        cdsFavouratesTitle.AsString := Prop.Title;
        cdsFavouratesPrice.AsString := Prop.Price;
        cdsFavouratesThumbImage.Assign(Prop.ThumbImage);
        cdsFavouratesImage.Assign(Prop.Image);
        cdsFavouratesThumbURL.AsString := Prop.ThumbURL;
        cdsFavouratesImageURL.AsString := Prop.ImageURL;
        cdsFavouratesBedrooms.AsString := Prop.Bedrooms;
        cdsFavouratesBathrooms.AsString := Prop.Bathrooms;
        cdsFavouratesSummary.AsString := Prop.Summary;
        cdsFavouratesDetailTitle.AsString := Prop.DetailTitle;
        cdsFavourates.Post;
      finally
        cdsFavourates.EnableControls;
      end;
    end;
  end;

  cdsFavourates.SaveToFile;
end;

{ TSearchXMLLoaderThread }

constructor TSearchDataLoaderThread.Create(AOwner: TdtmdlNestoria;
  const SearchURL: string; Page : Integer;
  ACallback: TProc<TNestoriaSearchResult>);
begin
  inherited Create(True); // Create suspended
  FOwner := AOwner;
  FSearchURL := SearchURL;
  FPage := Page;
  FCallback := ACallback;
end;

procedure TSearchDataLoaderThread.Execute;
var
  strJSON: string;
  LDownloader: TNestoriaHTTPServices.IDownloader;
  LResult: TNestoriaSearchResult;
  LProp: TNestoriaProperty;
begin

  LResult := nil;
  try
    LDownloader := TNestoriaHTTPServices.GetDownloader;
    try
      // Fetch the Data
      strJSON := LDownloader.DownloadSearchData(FSearchURL, FPage);
    finally
      LDownloader := nil;
    end;

    if CheckTerminated then
      Exit;

    LResult := TNestoriaJSONServices.LoadSearchJSON(strJSON, FOwner.LastSearchConfig);

    if CheckTerminated then
      Exit;

    try
      // Start loading the thumb images
      for LProp in LResult.Properties do
        // Start Asynch load of thumb image
        if not CheckTerminated then
          TNestoriaThreadServices.QueueLoadImage(LProp.ThumbURL)
        else
          break;

      if CheckTerminated then
        Exit;

      //TMonitor.Enter(GSynchLock);
      try
        TThread.Synchronize(nil,
        //Synchronize(
        procedure
        var
          Prop : TNestoriaProperty;
          AmbigiousLocation: TNestoriaSearchResult.TAmbiguousLocation;
        begin
          try
            if LResult.Result = nrtOK then
            begin
              FOwner.pbsSearchResults.Active := False;
              FOwner.pbsSearchResults.AutoActivate := False;
              try
                // Add properties to global list
                for Prop in LResult.ExtractProperties do
                  FOwner.PropertyResultList.Add(Prop);
              finally
                FOwner.pbsSearchResults.Active := True;
              end;
            end;

            if LResult.Result = nrtAmbiguous then
            begin
              FOwner.cdsAmbiguousSearchs.Close;
              FOwner.cdsAmbiguousSearchs.CreateDataSet;
              FOwner.cdsAmbiguousSearchs.DisableControls;
              for AmbigiousLocation in LResult.ExtractAmbiguousLocations do
              begin
                FOwner.cdsAmbiguousSearchs.Append;
                FOwner.cdsAmbiguousSearchsLOCATION.AsString := AmbigiousLocation.Location;
                FOwner.cdsAmbiguousSearchsID.AsString := AmbigiousLocation.ID;
                FOwner.cdsAmbiguousSearchs.Post;
              end;
              FOwner.cdsAmbiguousSearchs.EnableControls;
            end;
          except
            Application.HandleException(nil);
          end;
        end);
      finally
        //TMonitor.Exit(GSynchLock);
      end;
    finally
    end;
  finally
    //TMonitor.Enter(GSynchLock);
    try
      TThread.Synchronize(nil,
      //Synchronize(
      procedure
      begin
        FCallback(LResult);
      end);
    finally
      //TMonitor.Exit(GSynchLock)
    end;
    LResult.Free;
  end;
end;

end.
