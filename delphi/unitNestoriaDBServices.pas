//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaDBServices;

interface

uses Data.DB, unitNestoriaObjects;

type
  TNestoriaDBServices = class
  public
    class function LoadProperty(const DataSet : TDataSet): TNestoriaProperty; overload; static;
  end;

implementation

{ TNestoriaDBServices }

class function TNestoriaDBServices.LoadProperty(
  const DataSet: TDataSet): TNestoriaProperty;
begin
  Result := TNestoriaProperty.Create;
  Result.GUID := DataSet.FieldByName('GUID').AsString;
  Result.Title := DataSet.FieldByName('Title').AsString;
  Result.Price := DataSet.FieldByName('Price').AsString;
  Result.ThumbURL := DataSet.FieldByName('ThumbURL').AsString;
  Result.ImageURL := DataSet.FieldByName('ImageURL').AsString;
  Result.Bedrooms := DataSet.FieldByName('Bedrooms').AsString;
  Result.Bathrooms := DataSet.FieldByName('Bathrooms').AsString;
  Result.Summary := DataSet.FieldByName('Summary').AsString;
  if not DataSet.FieldByName('ThumbImage').IsNull then begin
    //FThumbImage := TImage.Create(nil);
    Result.ThumbImage.Assign(DataSet.FieldByName('ThumbImage'));
  end;
  if not DataSet.FieldByName('Image').IsNull then begin
    //FImage := TImage.Create(nil);
    Result.Image.Assign(DataSet.FieldByName('Image'));
  end;
end;

end.

