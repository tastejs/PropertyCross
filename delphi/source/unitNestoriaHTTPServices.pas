//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaHTTPServices;

interface

uses IdHTTP, FMX.Objects, FMX.Types, System.SysUtils, System.Classes;

type

  ///	<remarks>
  ///	  TNestoriaHTTPServices provides access to the IDownloader Interface for
  ///	  downloading data and images via a stream from Nestoria API
  ///	</remarks>
  TNestoriaHTTPServices = class
  public type
    TException = class(Exception);

    ///	<remarks>
    ///	  IDownloader is an Interface declaring the contract for downloading data from the Nestoria HTTP Services.
    ///	</remarks>
    IDownloader = interface

      ///	<remarks>
      ///	  DownloadImageStream is a procedure for collecting a Image
      ///	  from a URL for loading to a specific stream.
      ///	</remarks>
      procedure DownloadImageStream(const URL: string; const AStream: TStream);

      ///	<returns>
      ///	  string (typically XML or JSON) depending on params in the URL
      ///	</returns>
      ///	<remarks>
      ///	  Call DowloadSearchData to collect the XML / JSON result from the
      ///	  query URL to the Nestoria API
      ///   If the URL contains &lt;p&gt; this is replaced with the APage number.
      ///	</remarks>
      function DownloadSearchData(const URL: string; APage: Integer): string;
    end;
  public
    class function GetDownloader: IDownloader; static;
  end;

implementation

resourcestring
  sBlankURL = 'URL must not be blank';

type
  ///	<remarks>
  ///	  TDownloader is the class used for downloading the data and images for the searches.
  ///   It contains a TidHTTP component for talking to the remote server and logic to check for blank URL's
  ///	</remarks>
  TDownloader = class(TInterfacedObject, TNestoriaHTTPServices.IDownloader)
  private
    FHTTP: TIdHTTP;
  public
    constructor Create;
    destructor Destroy; override;
    procedure DownloadImageStream(const URL: string; const AStream: TStream);
    function DownloadSearchData(const URL: string; Page: Integer): string;
  end;

{ TNestoriaHTTPServices }

class function TNestoriaHTTPServices.GetDownloader: IDownloader;
begin
  Result := TDownloader.Create;
end;

{ TDownloader }

constructor TDownloader.Create;
begin
  FHTTP := TIdHttp.Create(nil);
end;

destructor TDownloader.Destroy;
begin
  FHTTP.Free;
  inherited;
end;

function TDownloader.DownloadSearchData(
  const URL: string; Page: Integer): string;
begin
  if URL = '' then
    raise TNestoriaHTTPServices.TException.Create(sBlankURL);
  // Fetch the Data
  Result := FHTTP.Get(StringReplace(URL,'<p>',IntToStr(Page),[rfIgnoreCase]));
end;


procedure TDownloader.DownloadImageStream(const URL: string; const AStream: TStream);
begin
  if URL = '' then
    raise TNestoriaHTTPServices.TException.Create(sBlankURL);
  try
    FHTTP.get(URL, AStream);
  except
    // Ignore
  end;
end;

end.
