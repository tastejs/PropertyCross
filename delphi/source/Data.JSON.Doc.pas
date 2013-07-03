//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit Data.JSON.Doc;

interface

uses
  System.Classes, Data.DBXJSON;

type
  TJSONDocument = class(TComponent)
  private
    FJSONValue: TJSONValue;
    FJSONStrings: TStringList;
    FStreamedActive: boolean;
    function GetJSONText: string;
    procedure SetJSONText(const Value: string);
    function IsJSONTextStored: boolean;
    function GetActive: boolean;
    procedure SetActive(const Value: boolean); virtual;
    function GetJSONValue: TJSONValue;
    procedure ParseJsonText;
  protected
    procedure Loaded; override;
  public
    class function IsSimpleJsonValue(v: TJSONValue): boolean; static;
    class function StripNonJson(s: string): string; static;
    class function UnQuote(s: string): string; static;
  public
    destructor Destroy; override;
    procedure AfterConstruction; override;
    property JSONValue: TJSONValue read GetJSONValue;
  published
    property Active: boolean read GetActive write SetActive default false;
    property JSONText: string read GetJSONText write SetJSONText stored IsJSONTextStored;
  end;

implementation

uses
  System.SysUtils, System.Character;

{ TJSONDocument }

procedure TJSONDocument.AfterConstruction;
begin
  inherited;
  FJSONStrings := TStringList.Create;
end;

destructor TJSONDocument.Destroy;
begin
  FreeAndNil(FJSONStrings);
  FreeAndNil(FJSONValue);
  inherited;
end;

function TJSONDocument.GetActive: boolean;
begin
  Result := Assigned(FJSONValue);
end;

function TJSONDocument.GetJSONText: string;
begin
  Result := FJSONStrings.Text;
end;

function TJSONDocument.GetJSONValue: TJSONValue;
begin
  Result := FJSONValue;
end;

procedure TJSONDocument.SetJSONText(const Value: string);
var
  WasActive : Boolean;
begin
  WasActive := Active;
  FJSONStrings.Text := Value;
  FreeAndNil(FJSONValue);
  if WasActive then
    ParseJsonText;
end;

procedure TJSONDocument.ParseJsonText;
var
  s: string;
  b : TBytes;
begin
  s := StripNonJson(Self.JSONText);

  b := TEncoding.UTF8.GetBytes(s);
  FJSONValue := TJSONObject.ParseJSONValue(b,0);
end;

function TJSONDocument.IsJSONTextStored: boolean;
begin
  Result := FJSONStrings.Count > 0;
end;

class function TJSONDocument.StripNonJson(s: string): string;
var ch: char; inString: boolean;
begin
  Result := '';
  inString := false;
  for ch in s do
  begin
    if ch = '"' then
      inString := not inString;

    if ch.IsWhiteSpace and not inString then
      continue;

    Result := Result + ch;
  end;
end;

class function TJSONDocument.UnQuote(s: string): string;
begin
  Result := Copy(s,2,Length(s)-2);
end;

class function TJSONDocument.IsSimpleJsonValue(v: TJSONValue): boolean;
begin
  Result := (v is TJSONNumber)
    or (v is TJSONString)
    or (v is TJSONTrue)
    or (v is TJSONFalse)
    or (v is TJSONNull);
end;

procedure TJSONDocument.SetActive(const Value: boolean);
begin
  if (csReading in ComponentState) then
  begin
    FStreamedActive := Value;
  end

  else
  if Value <> GetActive then
  begin
    FreeAndNil(FJSONValue);

    if Value then
      ParseJsonText;
  end;
end;

procedure TJSONDocument.Loaded;
begin
  inherited;
  try
    if FStreamedActive then SetActive(True);
  except
    if csDesigning in ComponentState then
      if Assigned(System.Classes.ApplicationHandleException) then
        System.Classes.ApplicationHandleException(ExceptObject)
      else
        ShowException(ExceptObject, ExceptAddr)
    else
      raise;
  end;
end;

end.
