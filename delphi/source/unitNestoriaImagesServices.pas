//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaImagesServices;

interface

uses System.Classes, FMX.Objects, FMX.Types, FMX.Forms;

type
  TNestoriaImageServices = class
  public type
    TImageLoadEvent = procedure(const AURL: string) of object;
  public
    class function IsImageCached(const AURL: string): Boolean;
    class function TryGetCacheImage(const AURL: string; const ABitmap: TBitmap; out AIsNull: Boolean): Boolean; overload; static;
    class procedure RegisterLoadEvent(const ALoadProc: TImageLoadEvent);
    class procedure UnregisterLoadEvent(const ALoadProc: TImageLoadEvent);
    //class procedure CacheImage(const AURL: string; const ABitmap: TBitmap; AOwnsImage: Boolean);
    class procedure CacheImageStream(const AURL: string; const AStream: TStream; AOwnsStream: Boolean);
  end;

implementation

uses unitImageCache, System.Generics.Collections, unitNestoriaThreadServices;

var
  FCache: TImageCache;
  FLoadEvents: TList<TNestoriaImageServices.TImageLoadEvent>;

{ TNestoriaImageServices }

//type
//  TOpenThread = class(TThread);
class procedure TNestoriaImageServices.CacheImageStream(const AURL: string;
  const AStream: TStream; AOwnsStream: Boolean);
begin
  // Cache is thread safe
  FCache.Add(AURL, AStream, AOwnsStream);
  //TMonitor.Enter(GSynchLock);
  try
  //TThread.Synchronize(nil,
  //TOpenThread(TThread.CurrentThread).Synchronize(
  TThread.Queue(nil,
    procedure
    var
      ALoadEvent: TImageLoadEvent;
    begin
      try
        for ALoadEvent in FLoadEvents do
          ALoadEvent(AUrl);
      except
        Application.HandleException(nil);

      end;
    end);
  finally
    //TMonitor.Exit(GSynchLock);
  end;
end;

class function TNestoriaImageServices.IsImageCached(const AURL: string): Boolean;
begin
  Result := FCache.ContainsKey(AURL);
end;

class procedure TNestoriaImageServices.RegisterLoadEvent(
  const ALoadProc: TImageLoadEvent);
begin
  Assert(TThread.CurrentThread.ThreadID = MainThreadID); // Assume events in main thread
  Assert(not FLoadEvents.Contains(ALoadProc));
  if not FLoadEvents.Contains(ALoadProc) then
    FLoadEvents.Add(ALoadProc);
end;

class function TNestoriaImageServices.TryGetCacheImage(const AURL: string;
  const ABitmap: TBitmap; out AIsNull: Boolean): Boolean;
begin
  Result := FCache.TryGetBitmap(AUrl, ABitmap, AIsNull);
end;

class procedure TNestoriaImageServices.UnregisterLoadEvent(
  const ALoadProc: TImageLoadEvent);
begin
  Assert(FLoadEvents.Contains(ALoadProc));
  FLoadEvents.Remove(ALoadProc);
end;

initialization
  FCache := TImageCache.Create;
  FLoadEvents := TList<TNestoriaImageServices.TImageLoadEvent>.Create;
finalization
  FLoadEvents.Free;
  FCache.Free;
end.
