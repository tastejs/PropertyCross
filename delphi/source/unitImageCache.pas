//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitImageCache;

interface

uses System.Generics.Collections, System.Classes, FMX.Objects, FMX.Types, FMX.Graphics;

type
  TImageCache<T> = class
  private type
    TInternalItem = class
    private
      FStream: TStream;
      FKey: T;
    public
      constructor Create(const AKey: T; const AStream: TStream);
      destructor Destroy; override;
    end;
    TInternalItems = TDictionary<T, TInternalItem>;
  private
    FLock: TObject;
    FItems: TInternalItems;
  public
    constructor Create;
    destructor Destroy; override;
    procedure Add(const AKey: T; const AStream: TStream; AOwnsStream: Boolean);
    function ContainsKey(const AKey: T): Boolean;
    function TryGetBitmap(const AKey: T; const ABitmap: TBitmap;
      out AIsNull: Boolean): Boolean;
  end;

  TImageCache = class(TImageCache<string>)
  end;

implementation

{ TImageCache<T>.TInternalItem }

constructor TImageCache<T>.TInternalItem.Create(const AKey: T;
  const AStream: TStream);
begin
  FKey := AKey;
  FStream := AStream;
end;

destructor TImageCache<T>.TInternalItem.Destroy;
begin
  FStream.Free;
  inherited;
end;

{ TImageCache<T> }

procedure TImageCache<T>.Add(const AKey: T; const AStream: TStream;
  AOwnsStream: Boolean);
var
  LStream: TStream;
begin
  LStream := AStream;
  if (AStream <> nil) and not AOwnsStream then
  begin
    LStream := TMemoryStream.Create;
    AStream.Seek(0, soFromBeginning);
    LStream.CopyFrom(AStream, 0)
  end
  else
    LStream := AStream;
  TMonitor.Enter(FLock);
  try
    if not FItems.ContainsKey(AKey) then  // Workaround: Destroying a Stream on secondary thread seems to cause problems
      FItems.AddOrSetValue(AKey, TInternalItem.Create(AKey, LStream));
  finally
    TMonitor.Exit(FLock);
  end;
end;

function TImageCache<T>.ContainsKey(const AKey: T): Boolean;
begin
  TMonitor.Enter(FLock);
  try
    Result := FItems.ContainsKey(AKey);
  finally
    TMonitor.Exit(FLock);
  end;
end;

constructor TImageCache<T>.Create;
begin
  FItems := TObjectDictionary<T, TInternalItem>.Create([doOwnsValues]);
  FLock := TObject.Create;
end;

destructor TImageCache<T>.Destroy;
begin
  FItems.Free;
  FLock.Free;
  inherited;
end;

function TImageCache<T>.TryGetBitmap(const AKey: T; const ABitmap: TBitmap;
  out AIsNull: Boolean): Boolean;
var
  LItem: TInternalItem;
begin
  AIsNull := False;
  Assert(ABitmap <> nil);
  TMonitor.Enter(FLock);
  try
    Result := FItems.TryGetValue(AKey, LItem);
    if Result then
      if LItem.FStream = nil then
        AIsNull := True
      else
      begin
        LItem.FStream.Seek(0, soFromBeginning);
        ABitmap.LoadFromStream(LItem.FStream);
      end;
  finally
    TMonitor.Exit(FLock);
  end;
end;

//function TImageCache<T>.TryGetStream(const AKey: T;
//  const AStream: TStream; out AIsNull: Boolean): Boolean;
//var
//  LItem: TInternalItem;
//begin
//  AIsNull := False;
//  Assert(AStream <> nil);
//  TMonitor.Enter(FLock);
//  try
//    Result := FItems.TryGetValue(AKey, LItem);
//    if Result then
//      if LItem.FStream = nil then
//        AIsNull := True
//      else
//      begin
//        LItem.FStream.Seek(0, soFromBeginning);
//        AStream.CopyFrom(LItem.FStream, 0);
//      end;
//  finally
//    TMonitor.Exit(FLock);
//  end;
//end;

end.
