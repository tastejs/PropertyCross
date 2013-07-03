//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaThreadServices;

interface

uses System.Classes;

type
  TNestoriaThreadServices = class
  public
    class procedure PushLoadImage(const AURL: string); static;
    class procedure QueueLoadImage(const AURL: string); static;
    class procedure AddThread(const AThread: TThread); static;
    class procedure WaitForAllThreads; static;
    class procedure CancelWorkInProgress; static;
  end;

//var
//  GSynchLock: TObject;

implementation

uses unitNestoriaImagesServices, unitNestoriaHTTPServices, System.Generics.Collections,
  Fmx.Types, Fmx.Objects;

type
  TImageThreadPool = class
  private
    FThreads: TThreadList<TThread>;
    FList: TThreadList<string>;
    FPulse: TObject;
    procedure WakeAllThreads;
    procedure CreateThreads;
    procedure WakeOneThread;
  public
    constructor Create;
    destructor Destroy; override;
    procedure CancelWork;
    procedure Terminate;
    procedure QueueImage(const AUrl: string);
    procedure PushImage(const AUrl: string);
  end;

  TImageThread = class(TThread)
  private
    FThreadPool: TImageThreadPool;
  protected
    procedure Execute; override;
  public
    constructor Create(const AThreadPool: TImageThreadPool);
    destructor Destroy; override;
  end;

  TThreadLists = class
  private
    FThreads: TThreadList<TThread>;
    FTerminatedThreads: TThreadList<TThread>;
    procedure OnTerminateThread(Sender: TObject);
    constructor Create;
    destructor Destroy; override;
    procedure FreeTerminatedThreads;
    procedure WaitForAllThreads;
    procedure TerminateAllThreads;
  end;
var
  GThreadLists: TThreadLists;
  GImageThreadPool: TImageThreadPool;


{ TNestoriaThreadServices }

class procedure TNestoriaThreadServices.QueueLoadImage(const AURL: string);
begin
  if not TNestoriaImageServices.IsImageCached(AURL) then
    GImageThreadPool.QueueImage(AURL);
end;

class procedure TNestoriaThreadServices.AddThread(const AThread: TThread);
begin
  // Assert is used to check the conditions for a thread being used with the services.
  Assert(AThread.Suspended);
  Assert(not Assigned(AThread.OnTerminate));
  Assert(not AThread.FreeOnTerminate);
  AThread.OnTerminate := GThreadLists.OnTerminateThread;
  GThreadLists.FreeTerminatedThreads; // Get rid of dormant threads
  GThreadLists.FThreads.Add(AThread);
end;

class procedure TNestoriaThreadServices.WaitForAllThreads;
begin
  GImageThreadPool.Terminate;
  GThreadLists.WaitForAllThreads;   // Block
  GThreadLists.FreeTerminatedThreads;
end;

class procedure TNestoriaThreadServices.CancelWorkInProgress;
begin
  GImageThreadPool.CancelWork;
  GThreadLists.TerminateAllThreads; // Do not block
end;

class procedure TNestoriaThreadServices.PushLoadImage(const AURL: string);
begin
  if not TNestoriaImageServices.IsImageCached(AURL) then
    GImageThreadPool.PushImage(AURL);
end;

{ TThreadLists }

constructor TThreadLists.Create;
begin
  FThreads := TThreadList<TThread>.Create;
  FTerminatedThreads := TThreadList<TThread>.Create;
end;

destructor TThreadLists.Destroy;
begin
  FThreads.Free;
  FTerminatedThreads.Free;
  inherited;
end;

procedure TThreadLists.OnTerminateThread(Sender: TObject);
var
  LList: TList<TThread>;
begin
  Assert(Sender is TThread);
  if Sender is TThread then
  begin
    LList := GThreadLists.FTerminatedThreads.LockList;
    try
      if Assigned(TThread(Sender).OnTerminate) then
        LList.Add(TThread(Sender));
    finally
      GThreadLists.FTerminatedThreads.LockList;
    end;
  end;
end;

procedure TThreadLists.FreeTerminatedThreads;
var
  LList, LListTerm: TList<TThread>;
  LThread: TThread;
begin
  LList := GThreadLists.FThreads.LockList;
  try
    LListTerm := GThreadLists.FTerminatedThreads.LockList;
    try
      while LListTerm.Count > 0 do
      begin
        LThread := LListTerm[0];
        LList.Remove(LThread);
        LListTerm.Delete(0);
        LThread.Free;
      end;
    finally
      GThreadLists.FTerminatedThreads.UnlockList;
    end;
  finally
    GThreadLists.FThreads.UnlockList;
  end;
end;

procedure TThreadLists.WaitForAllThreads;
var
  LList: TList<TThread>;
  LThread: TThread;
  LListTerm: TList<TThread>;
begin
  LList := GThreadLists.FThreads.LockList;
  try
    while LList.Count > 0 do
    begin
      LThread := LList[0];
      LList.Delete(0);
      LListTerm := GThreadLists.FTerminatedThreads.LockList;
      try
        LThread.OnTerminate := nil;
        LListTerm.Remove(LThread);
      finally
        GThreadLists.FTerminatedThreads.UnlockList;
      end;
      LThread.Free; // Terminate thread
    end;
  finally
    GThreadLists.FThreads.UnlockList;
  end;
end;

procedure TThreadLists.TerminateAllThreads;
var
  LList: TList<TThread>;
  LThread: TThread;
begin
  LList := GThreadLists.FThreads.LockList;
  try
    for LThread in LList do
      LThread.Terminate;
  finally
    GThreadLists.FThreads.UnlockList;
  end;
end;

{ TImageThread }

constructor TImageThread.Create(const AThreadPool: TImageThreadPool);
begin
  inherited Create(True); // Suspended
  FThreadPool := AThreadPool;
end;


destructor TImageThread.Destroy;
begin
  inherited;
end;

procedure TImageThread.Execute;
var
  LList: TList<string>;
  LUrl: string;
  LStream: TStream;
  LDownloader: TNestoriaHTTPServices.IDownloader;
begin
  LDownloader := TNestoriaHTTPServices.GetDownloader;
  while True do
  begin
    LUrl := '';
    LList := FThreadPool.FList.LockList;
    try
      if LList.Count > 0 then
      begin
        LUrl := LList[0];
        Assert(LUrl <> '');
        LList.Delete(0);
      end;
    finally
      FThreadPool.FList.UnlockList;
    end;
    if LUrl <> '' then
    begin
      LStream := TMemoryStream.Create;
      LDownloader.DownloadImageStream(LUrl, LStream);
      TNestoriaImageServices.CacheImageStream(LURL, LStream, True // Owns
        );
    end;
    if LUrl = '' then
    begin
      TMonitor.Enter(FThreadPool.FPulse);
      try
        // Wait for more work
        TMonitor.Wait(FThreadPool.FPulse, INFINITE);
      finally
        TMonitor.Exit(FThreadPool.FPulse);
      end;
    end;

    if CheckTerminated then
      break;
  end;
end;

{ TImageThreadPool }

constructor TImageThreadPool.Create;
begin
  inherited Create;
  FThreads := TThreadList<TThread>.Create;
  FList := TThreadList<string>.Create;
  FPulse := TObject.Create;
  CreateThreads;
end;

destructor TImageThreadPool.Destroy;
begin
  Terminate;
  inherited;
  FThreads.Free;
  FList.Free;
  FPulse.Free;
end;

procedure TImageThreadPool.Terminate;
var
  LThreads: TList<TThread>;
  LThread: TThread;
begin
  CancelWork;
  LThreads := FThreads.LockList;
  try
    for LThread in LThreads do
      LThread.Terminate;
    WakeAllThreads;
    while LThreads.Count > 0 do
    begin
      LThread := LThreads[0];
      LThreads.Delete(0);
      LThread.Free;   // Terminate thread
    end;
  finally
    FThreads.UnlockList;
  end;
end;

procedure TImageThreadPool.CancelWork;
var
  LList: TList<string>;
begin
  LList := FList.LockList;
  try
    LList.Clear;  // Clear URL's
  finally
    FList.UnlockList;
  end;
end;

procedure TImageThreadPool.PushImage(const AUrl: string);
var
  LList: TList<string>;
begin
  LList := FList.LockList;
  try
    LList.Remove(AUrl);
    LList.Insert(0, AUrl);
  finally
    FList.UnlockList;
  end;
  WakeOneThread;
end;

procedure TImageThreadPool.QueueImage(const AUrl: string);
var
  LList: TList<string>;
begin
  LList := FList.LockList;
  try
    if not LList.Contains(AUrl) then
      LList.Add(AUrl);
  finally
    FList.UnlockList;
  end;
  WakeOneThread;
end;

procedure TImageThreadPool.WakeOneThread;
begin
  TMonitor.Enter(FPulse);
  try
    TMonitor.Pulse(FPulse);
  finally
    TMonitor.Exit(FPulse);
  end;
end;

procedure TImageThreadPool.CreateThreads;
const
  cMinThreads = 2;
var
  LList: TList<TThread>;
  LThread: TThread;
begin
  LList := FThreads.LockList;
  try
    while LList.Count < cMinThreads do
    begin
      LThread := TImageThread.Create(Self);
      LThread.FreeOnTerminate := False;
      LList.Add(LThread);
      LThread.Start;
    end;
  finally
    FThreads.UnlockList;
  end;
end;

procedure TImageThreadPool.WakeAllThreads;
begin
  TMonitor.PulseAll(FPulse);
end;

initialization
  //GSynchLock := TObject.Create;
  GThreadLists := TThreadLists.Create;
  GImageThreadPool := TImageThreadPool.Create;
finalization
  TNestoriaThreadServices.WaitForAllThreads;
  GThreadLists.Free;
  GImageThreadPool.Free;
  //GSynchLock.Free;
end.
