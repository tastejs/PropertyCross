//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaSearchTypes;

interface

uses unitNestoriaObjects, System.Generics.Collections;

type
  ///	<remarks>
  ///	  TNestoriaSearchResultType provides an enum for the search outcome, providing the UI an appropriate next step
  ///	</remarks>
  TNestoriaSearchResultType = (nrtNotSet, nrtOK, nrtAmbiguous, nrtError);

  ///	<remarks>
  ///	  TNestoriaSearchResultType provides a common result from a search to the Nestoria API's
  ///	</remarks>
  TNestoriaSearchResult = class(TObject)
  public type
    TAmbiguousLocation = class(TObject)
    private
      FLocation: string;
      FID: string;
    public
      property Location: string read FLocation write FLocation;
      property ID: string read FID write FID;
    end;
  strict private
    FResult: TNestoriaSearchResultType;
    FMessage: string;
    FTotalRecordsForSearch: Integer;
    FProperties: TList<TNestoriaProperty>;
    FAmbiguousLocations: TList<TAmbiguousLocation>;
    function GetMessage: string;
  public
    constructor Create;
    destructor Destroy; override;
    function ExtractProperties: TArray<TNestoriaProperty>;
    function Properties: TArray<TNestoriaProperty>;
    function ExtractAmbiguousLocations: TArray<TAmbiguousLocation>;

    procedure AddProperty(const AValue: TNestoriaProperty);
    procedure AddAmbiguousLocation(const AValue: TAmbiguousLocation);

    ///	<remarks>
    ///	  Use this to understand the appropriate next step for a search
    ///	</remarks>
    property Result : TNestoriaSearchResultType read FResult write FResult;

    ///	<remarks>
    ///	  Provides the application_response_text node text, or a custom message
    ///	  when there is a access violation.
    ///	</remarks>
    property ApplicationMessage : string read GetMessage write FMessage;

    ///	<summary>
    ///	  TotalRecordsForSearch : Integer provides the total records returned
    ///	  for the search criteria (not the total returned so far)
    ///	</summary>
    property TotalRecordsForSearch: Integer read FTotalRecordsForSearch write FTotalRecordsForSearch;

  end;


  ///	<remarks>
  ///	  TNestoriaLastSearchConfig is used to store the last search URL, current
  ///	  page of results and total records in the search.
  ///	</remarks>
  TNestoriaLastSearchConfig = record

    ///	<remarks>
    ///	  Total Records in the search criteria
    ///	</remarks>
    TotalRecords : Integer;

    ///	<remarks>
    ///	  Current page the search data has returned. This should only be 
    ///	  updated after a successful search
    ///	</remarks>
    CurrentPage : Integer;

    ///	<remarks>
    ///	  base Search URL with &lt;p&gt; to replace to update page location
    ///	</remarks>
    BaseURL : string;
    procedure Reset(NewBaseURL : string);
  end;

implementation

{ TNestoriaResult }

procedure TNestoriaSearchResult.AddProperty(
  const AValue: TNestoriaProperty);
begin
  FProperties.Add(AValue);
end;

procedure TNestoriaSearchResult.AddAmbiguousLocation(
  const AValue: TAmbiguousLocation);
begin
  FAmbiguousLocations.Add(AValue);
end;

constructor TNestoriaSearchResult.Create;
begin
  inherited Create;
  Result := nrtNotSet;
  FMessage:= '';
  FProperties := TObjectList<TNestoriaProperty>.Create;
  FAmbiguousLocations := TObjectList<TAmbiguousLocation>.Create;
end;

destructor TNestoriaSearchResult.Destroy;
begin
  FProperties.Free;
  FAmbiguousLocations.Free;
  inherited;
end;

function TNestoriaSearchResult.ExtractProperties: TArray<TNestoriaProperty>;
begin
  Result := FProperties.ToArray;
  while FProperties.Count > 0 do
    FProperties.Extract(FProperties[0]);
end;

function TNestoriaSearchResult.ExtractAmbiguousLocations: TArray<TAmbiguousLocation>;
begin
  Result := FAmbiguousLocations.ToArray;
  while FAmbiguousLocations.Count > 0 do
    FAmbiguousLocations.Extract(FAmbiguousLocations[0]);
end;

function TNestoriaSearchResult.GetMessage: string;
begin
  if Self.TotalRecordsForSearch = 0 then
    Result := 'There were no properties found for the given location'
  else if FMessage > '' then
    Result := FMessage
  else if FResult = nrtError then
    Result := 'An error occurred while searching. Please check your network connection and try again.'
  else if FResult = nrtNotSet then // Should not see
    Result := 'Search result not set'
  else
    Result := '';
end;

function TNestoriaSearchResult.Properties: TArray<TNestoriaProperty>;
begin
  Result := FProperties.ToArray;
end;

{ TNestoriaLastSearchConfig }

procedure TNestoriaLastSearchConfig.Reset(NewBaseURL: string);
begin
  Self.CurrentPage := 1;
  Self.TotalRecords := 0;
  Self.BaseURL := NewBaseURL;
end;


end.
