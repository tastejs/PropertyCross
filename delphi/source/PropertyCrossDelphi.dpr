program PropertyCrossDelphi;

uses
  FMX.Forms,
  formMain in 'formMain.pas' {frmMain},
  dataNestoria in 'dataNestoria.pas' {dtmdlNestoria: TDataModule},
  unitNestoriaDBServices in 'unitNestoriaDBServices.pas',
  unitNestoriaHTTPServices in 'unitNestoriaHTTPServices.pas',
  unitNestoriaObjects in 'unitNestoriaObjects.pas',
  unitNestoriaSearchTypes in 'unitNestoriaSearchTypes.pas',
  unitImageCache in 'unitImageCache.pas',
  unitNestoriaImagesServices in 'unitNestoriaImagesServices.pas',
  unitNestoriaThreadServices in 'unitNestoriaThreadServices.pas',
  unitNestoriaJSONServices in 'unitNestoriaJSONServices.pas',
  Data.JSON.Doc in 'Data.JSON.Doc.pas',
  Data.JSON.Intf in 'Data.JSON.Intf.pas',
  Data.JSON.Objs in 'Data.JSON.Objs.pas',
  Data.JSON.Tokenizer in 'Data.JSON.Tokenizer.pas',
  BackButtonManager in 'BackButtonManager.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.FormFactor.Orientations := [TFormOrientation.soPortrait, TFormOrientation.soInvertedPortrait];
  Application.CreateForm(TdtmdlNestoria, dtmdlNestoria);
  Application.CreateForm(TfrmMain, frmMain);
  Application.Run;
end.
