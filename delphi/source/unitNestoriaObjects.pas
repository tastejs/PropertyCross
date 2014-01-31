//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaObjects;

interface

uses FMX.Types, FMX.Objects, FMX.Graphics;


{$SCOPEDENUMS ON}

type
  // Used to Return Data for each property and interface with the lists
  ///	<summary>
  ///	  TNestoriaProperty - Used to manage the filter the returned nodes from the calls to the NetoriaProperty API
  ///	</summary>
  ///
  TNestoriaProperty = class(TObject)
  public type
    TImageState = (Empty, Assigned);
  private
    FImage: TImage;
    FThumbImage: TImage;
    FPrice: string;
    FID: string;
    FImageURL: string;
    FSummary: string;
    FThumbURL: string;
    FBathrooms: string;
    FString: string;
    FBedrooms: string;
    FDetailTitle: string;
    FImageState: TImageState;
    FThumbImageState: TImageState;
    function GetDetailTitle: string;
    function GetImage: TBitmap;
    function GetRoomText: string;
    function GetThumbImage: TBitmap;
  public
    ///	<remarks>
    ///	  Takes a 'listings' node to extract the property data.
    ///	</remarks>
    constructor Create;
    destructor Destroy; override;
    property GUID : string read FID write FID;
    property ThumbURL : string read FThumbURL write FThumbURL;
    property Title : string read FString write FString;
    property Price : string read FPrice write FPrice;
    property ImageURL : string read FImageURL write FImageURL;
    property DetailTitle : string read GetDetailTitle;
    property Bedrooms : string read FBedrooms write FBedrooms;
    property Bathrooms : string read FBathrooms write FBathrooms;
    property Summary : string read FSummary write FSummary;

    ///	<remarks>
    ///	  First call fetches image for the ThumbURL (if it exists) and caches
    ///	  into the object
    ///	</remarks>
    property ThumbImage : TBitmap read GetThumbImage;

    ///	<remarks>
    ///	  First call fetches image for the ImageURL (if it exists) and caches
    ///	  into the object
    ///	</remarks>
    property Image : TBitmap read GetImage;
    property RoomsText : string read GetRoomText;
    property ThumbImageState: TImageState read FThumbImageState write FThumbImageState;
    property ImageState: TImageState read FImageState write FImageState;
  end;

implementation

uses System.SysUtils, unitNestoriaImagesServices,
  unitNestoriaThreadServices;

{ TNestoriaProperty }

constructor TNestoriaProperty.Create;
begin
  inherited Create;
  FThumbImage := TImage.Create(nil);
  FThumbImageState := TImageState.Empty;
  FImage := TImage.Create(nil);
  FImageState := TImageState.Empty;
end;


destructor TNestoriaProperty.Destroy;
begin
  FImage.Free;
  FThumbImage.Free;
  inherited;
end;

function TNestoriaProperty.GetDetailTitle: string;
begin
  if FDetailTitle = '' then begin
    FDetailTitle := StringReplace(Title,',','/',[]);
    FDetailTitle := Copy(FDetailTitle,0,Pos(',',FDetailTitle)-1);
  end;
  Result := FDetailTitle;
end;

function TNestoriaProperty.GetImage: TBitmap;
var
  LIsNull: Boolean;
begin
  if (FImageState = TImageState.Empty) and (FImageURL <> '') then
    if TNestoriaImageServices.TryGetCacheImage(FImageURL, FImage.Bitmap, LIsNull) then
      FImageState := TImageState.Assigned
    else
      TNestoriaThreadServices.PushLoadImage(FImageURL);
  Result := FImage.Bitmap;
end;

function TNestoriaProperty.GetRoomText: string;
begin
  // TO-DO Shift to a live binding.
  if (Trim(Bedrooms) > '') and (Trim(Bathrooms) > '') then
    Result := Format('%s Bedrooms, %s Bathrooms',[Bedrooms, Bathrooms])
  else if Trim(Bedrooms) > '' then
    Result := Format('%s Bedrooms',[Bedrooms])
  else if Trim(Bathrooms) > '' then
    Result := Format('%s Bathrooms',[Bathrooms]);
end;

function TNestoriaProperty.GetThumbImage: TBitmap;
var
  LIsNull: Boolean;
begin
  if (FThumbImageState = TImageState.Empty) and (FThumbURL <> '') then
    if TNestoriaImageServices.TryGetCacheImage(FThumbURL, FThumbImage.Bitmap, LIsNull) then
      FThumbImageState := TImageState.Assigned
    else
      TNestoriaThreadServices.QueueLoadImage(FThumbURL);
  Result := FThumbImage.Bitmap;
end;

end.
