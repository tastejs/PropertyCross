//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit Data.JSON.Tokenizer;

interface

uses
  Data.DBXJSON, Data.JSON.Doc, System.Types, System.Classes;

type
  TJSONTokenKind = (
    jsNumber,
    jsString,
    jsTrue,
    jsFalse,
    jsNull,
    jsObjectStart,
    jsObjectEnd,
    jsArrayStart,
    jsArrayEnd,
    jsPairStart,
    jsPairEnd
  );

  TJSONToken = record
    Kind: TJSONTokenKind;
    Content: string;
    constructor Create(const AKind: TJSONTokenKind; const AContent: string);
  end;

  TJSONOnTokenEvent = procedure(const Token: TJSONToken) of object;
  TJSONOnTokenProc = reference to procedure(const Token: TJSONToken);


  TJSONTokenizer = class(TJSONDocument)
  private
    FOnToken: TJSONOnTokenEvent;
    FOnFinish: TNotifyEvent;
    procedure DoProcess(const v: TJSONValue; const aTokenProc: TJSONOnTokenProc);
  protected
    procedure DoOnToken(const Token: TJSONToken); virtual;
  public
    procedure Tokenize;
  published
    property OnToken: TJSONOnTokenEvent read FOnToken write FOnToken;
    property OnFinish : TNotifyEvent read FOnFinish write FOnFinish;
  end;

implementation

{ TJSONToken }

constructor TJSONToken.Create(const AKind: TJSONTokenKind; const AContent: string);
begin
  Kind := AKind;
  Content := AContent;
end;

{ TJSONTokenizer }

procedure TJSONTokenizer.DoOnToken(const Token: TJSONToken);
begin
  if Assigned(FOnToken) then
    FOnToken(Token);
end;

procedure TJSONTokenizer.Tokenize;
begin
  if JSONValue <> nil then
    DoProcess(JSONValue, DoOnToken);
  if Assigned(OnFinish) then
    OnFinish(Self);
end;

procedure TJSONTokenizer.DoProcess(const v: TJSONValue; const aTokenProc: TJSONOnTokenProc);
var i: integer;
begin
  if v is TJSONNumber then
    aTokenProc(TJSONToken.Create(jsNumber, TJSONNumber(v).Value))

  else if v is TJSONString then
    aTokenProc(TJSONToken.Create(jsString, TJSONString(v).Value))

  else if v is TJSONTrue then
    aTokenProc(TJSONToken.Create(jsTrue, 'true'))

  else if v is TJSONFalse then
    aTokenProc(TJSONToken.Create(jsFalse, 'false'))

  else if v is TJSONNull then
    aTokenProc(TJSONToken.Create(jsNull, 'null'))

  else if v is TJSONArray then
  begin
    aTokenProc(TJSONToken.Create(jsArrayStart, ''));
    with v as TJSONArray do
      for i := 0 to Size - 1 do
        DoProcess(Get(i), aTokenProc);
    aTokenProc(TJSONToken.Create(jsArrayEnd, ''));
  end

  else if v is TJSONObject then
  begin
    aTokenProc(TJSONToken.Create(jsObjectStart, ''));
    with v as TJSONObject do
     for i := 0 to Size - 1 do
       begin
         aTokenProc(TJSONToken.Create(jsPairStart, Get(i).JsonString.ToString));
         DoProcess(Get(i).JsonValue, aTokenProc);
         aTokenProc(TJSONToken.Create(jsPairEnd, ''));
       end;
    aTokenProc(TJSONToken.Create(jsObjectEnd, ''));
  end;
end;

end.
