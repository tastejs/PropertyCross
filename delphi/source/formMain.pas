//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit formMain;

interface

uses
  System.SysUtils, System.Types, System.UITypes, System.Classes, System.Variants,
  FMX.Types, FMX.Controls, FMX.Forms, FMX.Dialogs, FMX.TabControl,
  System.Actions, FMX.ActnList, Data.Bind.EngExt, Fmx.Bind.DBEngExt,
  System.Rtti, System.Bindings.Outputs, Fmx.Bind.Editors, FMX.Objects,
  Data.Bind.Components, Data.Bind.DBScope, FMX.ListBox, FMX.Layouts,
  FMX.StdCtrls, FMX.Edit, dataNestoria, unitNestoriaObjects,
  FMX.ListView.Types, FMX.ListView, FMX.Graphics,
  unitNestoriaSearchTypes, FMX.Sensors, System.Sensors;

type
  TfrmMain = class(TForm)
    tcMain: TTabControl;
    tabHome: TTabItem;
    tabFavourates: TTabItem;
    TopToolBar: TToolBar;
    ToolBarLabel: TLabel;
    TopToolBar1: TToolBar;
    ToolBarLabel1: TLabel;
    btnBack: TButton;
    ActionList1: TActionList;
    ctaFavourates: TChangeTabAction;
    ctaHome: TChangeTabAction;
    btnFavourates: TButton;
    lblDescription: TLabel;
    edtLocation: TEdit;
    btnGo: TButton;
    btnMyLocation: TButton;
    lbSearchedLocations: TListBox;   //
    lblSearchResultsTitle: TLabel;
    ListBoxItem1: TListBoxItem;
    ListBoxItem2: TListBoxItem;
    ListBoxItem3: TListBoxItem;
    ListBoxItem4: TListBoxItem;
    tabSearchResult: TTabItem;
    tabPropertyDetails: TTabItem;
    ToolBar1: TToolBar;
    lblResultTitle: TLabel;
    btnHome: TButton;
    ToolBar2: TToolBar;
    Label3: TLabel;
    btnPropDetailsBack: TButton;
    layoutButtons: TLayout;
    AnimatorLoading: TAniIndicator;
    BindingsList1: TBindingsList;
    BindSourceDBRecentSearches: TBindSourceDB;
    LinkListControlToField1: TLinkListControlToField;
    tcSearchResults: TTabControl;
    tabSearchLocations: TTabItem;
    tabSearchMessage: TTabItem;
    tabSearchChooseFromMultipleLocation: TTabItem;
    lbMultipleResultLocations: TListBox; //
    ListBoxItem7: TListBoxItem;
    ListBoxItem8: TListBoxItem;
    Label1: TLabel;
    lblSearchMessage: TLabel;
    BindSourceDBAmbiguous: TBindSourceDB;
    lfctfAmbigiousLocations: TLinkFillControlToField; //
    ctaSearchResults: TChangeTabAction;
    ctaPropertyDetail: TChangeTabAction;
    lblPropDetailTitle: TLabel;
    lblPropDetailPrice: TLabel;
    lblRoomsDetail: TLabel;
    lblPropDetailText: TLabel;
    Image1: TImage;
    btnAddRemoveFavourate: TButton; //
    BindSourceFavourates: TBindSourceDB;
    actAddFavourate: TAction;
    actRemoveFavourate: TAction;
    LinkPropertyToFieldText: TLinkPropertyToField;
    LinkPropertyToFieldText2: TLinkPropertyToField;
    LinkPropertyToFieldBitmap: TLinkPropertyToField;
    LinkPropertyToFieldText3: TLinkPropertyToField;
    LinkPropertyToFieldText4: TLinkPropertyToField;
    lbFavourates: TListBox;
    LinkListControlToFavs: TLinkListControlToField;
    lvSearchResults: TListView;
    LinkFillControlToSearchResults: TLinkFillControlToField;
    ListItemClickTimer: TTimer;
    TimerCheckSynchronize: TTimer;
    TimerNextPage: TTimer;
    LocationSensor1: TLocationSensor;
    TimerSearchTimeout: TTimer;
    procedure btnGoClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure btnMyLocationClick(Sender: TObject);
    procedure lbMultipleResultLocationsItemClick(const Sender: TCustomListBox;
      const Item: TListBoxItem);
    procedure lbSearchedLocationsItemClick(const Sender: TCustomListBox;
      const Item: TListBoxItem);
    procedure tcMainChange(Sender: TObject);
    procedure actAddFavourateExecute(Sender: TObject);
    procedure actRemoveFavourateExecute(Sender: TObject);
    procedure lbFavouratesItemClick(const Sender: TCustomListBox;
      const Item: TListBoxItem);
    procedure lvSearchResultsItemClick(const Sender: TObject;
      const AItem: TListViewItem);
    procedure ListItemClickTimerTimer(Sender: TObject);
    procedure lvSearchResultsUpdateObjects(const Sender: TObject;
      const AItem: TListViewItem);
    procedure TimerCheckSynchronizeTimer(Sender: TObject);
    procedure TimerNextPageTimer(Sender: TObject);
    procedure LocationSensor1LocationChanged(Sender: TObject; const OldLocation,
      NewLocation: TLocationCoord2D);
    procedure LocationSensor1StateChanged(Sender: TObject);
    procedure TimerSearchTimeoutTimer(Sender: TObject);
    procedure FormKeyUp(Sender: TObject; var Key: Word; var KeyChar: Char;
      Shift: TShiftState);
    procedure LocationSensor1DataChanged(Sender: TObject);
  private
    { Private declarations }
    FNextPageAniIndicator: TAniIndicator;
    procedure UpdateAddRemoveFavourateOption;
    procedure ProcessSearchResultToScreen(Result: TNestoriaSearchResult);
    procedure OnLoadImage(const AURL: string);
    procedure DisplaySearchMessage(const aMessage : string);
  public
    destructor Destroy; override;
    { Public declarations }
  end;

const
  LastItemTag = 99999;
var
  frmMain: TfrmMain;

implementation

{$R *.fmx}

uses unitNestoriaImagesServices, unitNestoriaThreadServices, BackButtonManager;

procedure TfrmMain.actAddFavourateExecute(Sender: TObject);
begin
  dtmdlNestoria.SetPropertyFavourateState(True,dtmdlNestoria.CurrentProperty.GUID);
  UpdateAddRemoveFavourateOption;
end;

procedure TfrmMain.actRemoveFavourateExecute(Sender: TObject);
begin
  dtmdlNestoria.SetPropertyFavourateState(False,dtmdlNestoria.CurrentProperty.GUID);
  UpdateAddRemoveFavourateOption;
end;

procedure TfrmMain.btnGoClick(Sender: TObject);
var
  LProc: TProc<TNestoriaSearchResult>;
begin
  AnimatorLoading.Visible := True;
  AnimatorLoading.Enabled := True;
  AnimatorLoading.Repaint;
{$IFDEF IOS or ANDROID}
  // Work around.  Force CheckSynchronize when animation is running.
  TimerCheckSynchronize.Enabled := True;
{$ENDIF}

  // Callback
  LProc :=
    procedure(AResult: TNestoriaSearchResult)
    begin
{$IFDEF IOS or ANDROID}
      TimerCheckSynchronize.Enabled := False;
{$ENDIF}
      if AResult <> nil then
        ProcessSearchResultToScreen(AResult);
      AnimatorLoading.Visible := False;
      AnimatorLoading.Enabled := False;
    end;

  // Asynch call
  if Sender = btnGo then
    dtmdlNestoria.FindProperties(edtLocation.Text,
      LProc)
  else
    dtmdlNestoria.LoadNextPage(
      LProc)

end;

procedure TfrmMain.btnMyLocationClick(Sender: TObject);
begin
  DisplaySearchMessage('Location Search...');
  TimerSearchTimeout.Enabled := True;
  LocationSensor1.Active := True;
end;

destructor TfrmMain.Destroy;
begin
  TNestoriaThreadServices.WaitForAllThreads; // Terminate.  Threads references this object.
  inherited;
end;

procedure TfrmMain.DisplaySearchMessage(const aMessage: string);
begin
  tcSearchResults.ActiveTab := tabSearchMessage;
  lblSearchMessage.Text := aMessage;
end;

procedure TfrmMain.FormCreate(Sender: TObject);
begin
  tcMain.ActiveTab := tabHome;
  tcSearchResults.ActiveTab := tabSearchLocations;
  TNestoriaImageServices.RegisterLoadEvent(OnLoadImage);
  LinkFillControlToSearchResults.AutoFill := False;
  LinkFillControlToSearchResults.BindList.ClearList;

  if TOSVersion.Platform = pfAndroid then
    TBackActionManager.HideBackActionControls(Self, True);
end;

procedure TfrmMain.FormKeyUp(Sender: TObject; var Key: Word; var KeyChar: Char;
  Shift: TShiftState);
var
  BackAction : TChangeTabAction;
begin
  if (TOSVersion.Platform = pfAndroid) and (Key = vkHardwareBack) then begin
    BackAction := TBackActionManager.FindBackAction(tcMain,True);
    if Assigned(BackAction) then begin
      BackAction.ExecuteTarget(Self);
      Key := 0;
    end;
  end;
end;

procedure TfrmMain.OnLoadImage(const AURL: string);
var
  LItem: TListViewItem;
  LProperty: TNestoriaProperty;
  I: Integer;
begin
  I := 0;
  for LProperty in dtmdlNestoria.PropertyResultList do
  begin
    // Update list
    if SameText(AUrl, LProperty.ThumbURL) then
    begin
      if I < lvSearchResults.Items.Count then
      begin
        LItem := lvSearchResults.Items[I];
        LItem.Bitmap := LProperty.ThumbImage;
      end;
    end;
    if dtmdlNestoria.pbsSearchResults.InternalAdapter.CurrentIndex = I then
    begin
      if SameText(AURL, LProperty.ImageURL) then
        dtmdlNestoria.pbsSearchResults.InternalAdapter.Refresh;
    end;
    Inc(I);
  end;
end;

procedure TfrmMain.lbFavouratesItemClick(const Sender: TCustomListBox;
  const Item: TListBoxItem);
begin
  // Temp Work around Sync bug
  if not dtmdlNestoria.cdsFavourates.Locate('Title',Item.ItemData.Detail,[]) then
    Exit;
  // Temp work around end

  if not dtmdlNestoria.FetchPropertyByGUID(dtmdlNestoria.cdsFavourates.FieldByName('GUID').AsString) then begin
    ShowMessage('Unable to locate property');
    Exit;
  end;

  btnPropDetailsBack.Action := ctaFavourates; // Set the back to return to Favourates

  // Here we get a problem...
  ctaPropertyDetail.ExecuteTarget(tcMain.ActiveTab);
end;

procedure TfrmMain.lbMultipleResultLocationsItemClick(
  const Sender: TCustomListBox; const Item: TListBoxItem);
begin
  edtLocation.Text := Item.Text;
  btnGoClick(btnGo);
end;

procedure TfrmMain.lbSearchedLocationsItemClick(const Sender: TCustomListBox;
  const Item: TListBoxItem);
begin
  edtLocation.Text := Item.Text;
  btnGo.OnClick(btnGo);
end;

procedure TfrmMain.lvSearchResultsItemClick(const Sender: TObject;
  const AItem: TListViewItem);
begin
  if AItem.Tag = LastItemTag then
  begin
    // Click on "next page" list item
    // Use a timer because we can't change the listview while in itemclick event
    ListItemClickTimer.Enabled := True;
  end
  else
  begin

    dtmdlNestoria.pbsSearchResults.ItemIndex := AItem.Index;
    btnPropDetailsBack.Action := ctaSearchResults;  // Set the back to return to Results

    // Show Data for property
    ctaPropertyDetail.ExecuteTarget(tcMain.ActiveTab);
  end;
end;

procedure TfrmMain.lvSearchResultsUpdateObjects(const Sender: TObject;
  const AItem: TListViewItem);
var
  LText: TListItemText;
  LDetail: TListItemText;
  LOuterWidth: Single;
begin
  // Code to adjust Custom appearance according to window width
  // Set width of text and detail so that text is trimmed
  LText := AItem.Objects.TextObject;
  LDetail := AItem.Objects.DetailObject;
  LOuterWidth := lvSearchResults.Width - lvSearchResults.ItemSpaces.Left - lvSearchResults.ItemSpaces.Right;
  LText.Width := LOuterWidth - LText.PlaceOffset.X - 6;
  LDetail.Width := LOuterWidth - LDetail.PlaceOffset.X - 6;

end;

procedure TfrmMain.UpdateAddRemoveFavourateOption;
var
  CurrProp: TNestoriaProperty;
begin
  CurrProp := dtmdlNestoria.CurrentProperty;
  if CurrProp = nil then
    Exit;

  if dtmdlNestoria.cdsFavourates.Locate('GUID',CurrProp.GUID,[]) then
    btnAddRemoveFavourate.Action := actRemoveFavourate
  else
    btnAddRemoveFavourate.Action := actAddFavourate;
end;

var
  FTopItem: Integer;
type
  TOpenListView = class(TListView);
procedure TfrmMain.ProcessSearchResultToScreen(Result: TNestoriaSearchResult);
var
  ListViewItem: TListViewItem;
  LProperty: TNestoriaProperty;
  I: Integer;
  LTopItem: Integer;
begin
  case Result.Result of
    nrtOK:
      begin
        if (LinkFillControlToSearchResults.AutoFill = False) or
          (LinkFillControlToSearchResults.Active = False) then
        begin
          // Optimization.  Append to listview rather than refill
          lvSearchResults.BeginUpdate;
          try
            LTopItem := -1;
            if dtmdlNestoria.LastSearchConfig.CurrentPage = 1 then begin
              lvSearchResults.ItemIndex := -1;
              lvSearchResults.Items.Clear;
            end else
              if (lvSearchResults.Items.Count > 0) and
                (lvSearchResults.Items[lvSearchResults.Items.Count-1].Tag = LastItemTag) then
              begin
                LTopItem := lvSearchResults.Items.Count-1;
                lvSearchResults.Items.Delete(lvSearchResults.Items.Count-1);
              end;
            for I := lvSearchResults.Items.Count to dtmdlNestoria.PropertyResultList.Count - 1 do
            begin
              LProperty := dtmdlNestoria.PropertyResultList[I];
              with lvSearchResults.Items.Add do
              begin
                Text := LProperty.Price;
                Detail := LProperty.Title;
                Bitmap := LProperty.ThumbImage;
              end;
            end;
            if (dtmdlNestoria.LastSearchConfig.CurrentPage = 1) and
              (lvSearchResults.Items.Count > 0) then
              lvSearchResults.ScrollTo(0);
          finally
            lvSearchResults.EndUpdate;
          end;
          if LTopItem <> -1 then
          begin
            FTopItem := LTopItem;
{$IFDEF IOS or ANDROID} // Scroll up a little to show more rows
            TimerNextPage.Enabled := True;
{$ENDIF}
          end;
        end;
        // Load in the list...
        lblResultTitle.Text := Format('%d of %d results', [dtmdlNestoria.PropertyResultList.Count, Result.TotalRecordsForSearch]);
        tcSearchResults.ActiveTab := tabSearchLocations;

        if dtmdlNestoria.PropertyResultList.Count < Result.TotalRecordsForSearch then
        begin
          // Add ListViewItem
          ListViewItem := lvSearchResults.Items.Add;
          ListViewItem.Objects.ImageObject.Visible := False;
          ListViewItem.Text := lblResultTitle.Text;
          ListViewItem.Detail := 'Load More...';
          ListViewItem.Tag := LastItemTag;
        end;

        if tcMain.ActiveTab <> tabSearchResult then
          ctaSearchResults.ExecuteTarget(tcMain.ActiveTab);

      end;
    nrtAmbiguous:
      begin
        tcSearchResults.ActiveTab := tabSearchChooseFromMultipleLocation;
        lfctfAmbigiousLocations.BindList.FillList;
      end;
  else
    begin
      DisplaySearchMessage(Result.ApplicationMessage);
    end;
  end;
end;

procedure TfrmMain.tcMainChange(Sender: TObject);
begin
  // Property Details
  if tcMain.ActiveTab = tabPropertyDetails then
    UpdateAddRemoveFavourateOption;
end;

procedure TfrmMain.TimerCheckSynchronizeTimer(Sender: TObject);
begin
  try
    CheckSynchronize;
  except
    Application.HandleException(nil);
  end;
end;

var
  FItemRect: TRectF;
  FRange: Single;
  FStep: Integer;
const
  FSteps = 5;
  FStepSize = 3;

// Experimental code to slow scroll some items into view
procedure TfrmMain.TimerNextPageTimer(Sender: TObject);
begin
  if FStep = 0 then
    FStep := 1
  else if FStep = 1 then
  begin
    FItemRect := lvSearchResults.GetItemRect(FTopItem);
    FRange := FItemRect.Height * FStepSize;
    FStep := 2;
    if (FItemRect.Top < lvSearchResults.Position.Y + lvSearchResults.Height) and
      (FItemRect.Top > lvSearchResults.Position.Y) then
    begin
      TOpenListView(lvSearchResults).MouseDown(TMouseButton.mbLeft,
        [], lvSearchResults.Width / 2,
        FItemRect.Top + FItemRect.Height /2);
      TOpenListView(lvSearchResults).MouseMove(
        [], lvSearchResults.Width / 2,
        FItemRect.Top + FItemRect.Height /2);
    end
    else
    begin
      Self.TimerNextPage.Enabled := False;
    end;
  end
  else
  begin
    Inc(FStep);
    FItemRect.Offset(0, FRange / FSteps * -1.0);
    begin
      TOpenListView(lvSearchResults).MouseMove(
        [], lvSearchResults.Width / 2,
        FItemRect.Top + FItemRect.Height /2);
    end;
    if FStep >= FSteps - 1 then
    begin
      TOpenListView(lvSearchResults).MouseUp(
        TMouseButton.mbLeft, [], lvSearchResults.Width / 2,
        FItemRect.Top + FItemRect.Height /2);
      Self.TimerNextPage.Enabled := False;
      FStep := 0;
    end;
  end;
end;

procedure TfrmMain.TimerSearchTimeoutTimer(Sender: TObject);
begin
  TimerSearchTimeout.Enabled := False;
  LocationSensor1.Active := False;

end;

procedure TfrmMain.ListItemClickTimerTimer(Sender: TObject);
var
  LProc: TProc<TNestoriaSearchResult>;
begin
  lvSearchResults.ItemIndex := -1;

  ListItemClickTimer.Enabled := False;

  if FNextPageAniIndicator <> nil then Exit;

  FNextPageAniIndicator := TAniIndicator.Create(Self);
  FNextPageAniIndicator.Parent := lvSearchResults;
  FNextPageAniIndicator.Align := TAlignLayout.alBottom;
  FNextPageAniIndicator.HitTest := False;
  FNextPageAniIndicator.Enabled := True;
{$IFDEF IOS or ANDROID}
  // Work around.  Force CheckSynchronize when animation is running.
  TimerCheckSynchronize.Enabled := True;
{$ENDIF}

  // Callback
  LProc :=
    procedure(AResult: TNestoriaSearchResult)
    begin
{$IFDEF IOS or ANDROID}
      TimerCheckSynchronize.Enabled := False;
{$ENDIF}
      if AResult <> nil then
        ProcessSearchResultToScreen(AResult);
      FNextPageAniIndicator.DisposeOf;
      FNextPageAniIndicator := nil;
      //FreeAndNil(FNextPageAniIndicator);
    end;

  // Asynch load
  dtmdlNestoria.LoadNextPage(LProc)
end;

procedure TfrmMain.LocationSensor1DataChanged(Sender: TObject);
begin
//
end;

procedure TfrmMain.LocationSensor1LocationChanged(Sender: TObject;
  const OldLocation, NewLocation: TLocationCoord2D);
begin
  LocationSensor1.Active := False;
  TimerSearchTimeout.Enabled := False;
  if (NewLocation.Latitude <> 0) and (NewLocation.Longitude <> 0) then begin
    // Asynch call
    dtmdlNestoria.FindPropertiesByLocation(NewLocation.Latitude, NewLocation.Longitude,
      procedure(AResult: TNestoriaSearchResult)
      begin
        ProcessSearchResultToScreen(AResult);
      end);
  end;
end;

procedure TfrmMain.LocationSensor1StateChanged(Sender: TObject);
begin
  case LocationSensor1.Sensor.State of
    TSensorState.AccessDenied: DisplaySearchMessage('The use of location is currently disabled');
    TSensorState.Error,
    TSensorState.NoData      : DisplaySearchMessage('The location given was not recognied');
    TSensorState.Added       : DisplaySearchMessage('The location has been Added - Please Try Again');
    TSensorState.Removed     : DisplaySearchMessage('The location was been Removed');
    else Exit;
  end;
end;

end.
