unit BackButtonManager;

interface

uses FMX.TabControl, FMX.Types, System.Classes, FMX.Forms, System.Actions;

type
  TActionHelper = class helper for TFMXObject
    function GetFMXAction: TBasicAction;
  end;

  TBackActionManager = class
  private
  public
    class procedure HideBackActionControls(Root : TFMXObject; UpdateActionState: Boolean);
    class function FindBackAction(TabControl : TTabControl; IncInvisibleLinks : Boolean): TChangeTabAction; overload;
    class function FindBackAction(CurrFMXObj : TFMXObject; IncInvisibleLinks : Boolean): TChangeTabAction; overload;
  end;

implementation

uses FMX.Controls, System.SysUtils, System.Generics.Collections;

{ TActionFinder }

class function TBackActionManager.FindBackAction(TabControl: TTabControl;
  IncInvisibleLinks: Boolean): TChangeTabAction;
begin
  Result := nil;

  if (TabControl = nil) or (TabControl.ActiveTab = nil) then
    Exit;

  // Find the active Page... If it has a control with ChangeTabAction, and BackStyle :-)
  // If not, Has it got a PageControl... if so recursively call.
  Result := FindBackAction(TabControl.ActiveTab,IncInvisibleLinks);
end;

class procedure TBackActionManager.HideBackActionControls(Root: TFMXObject; UpdateActionState: Boolean);
var
  I : Integer;
  Comp : TFMXObject;
  Control : TStyledControl;
  Action: TBasicAction;
begin
  if Root = nil then
    Exit;

  for I := 0 to Pred(Root.ChildrenCount) do begin
    Comp := Root.Children.Items[I];
    if Comp is TStyledControl then begin
      Control := TStyledControl(Comp);

      if Control.Visible then begin
        if LowerCase(Control.StyleLookup) = 'backtoolbutton' then begin
          Action := Control.GetFMXAction;
          if UpdateActionState and Assigned(Action) and (Action is TContainedAction) then
            TContainedAction(Action).Visible := False
          else
            Control.Visible := False;
        end;
      end;
    end;
    TBackActionManager.HideBackActionControls(Comp, UpdateActionState);
  end;
end;


class function TBackActionManager.FindBackAction(CurrFMXObj: TFMXObject;
  IncInvisibleLinks: Boolean): TChangeTabAction;
var
  I : Integer;
  Comp : TFMXObject;
  Control : TStyledControl;
  Action: TBasicAction;
begin
  Result := nil;

  if CurrFMXObj = nil then
    Exit(nil);

  for I := 0 to Pred(CurrFMXObj.ChildrenCount) do begin
    Comp := CurrFMXObj.Children.Items[I];
    if Comp is TStyledControl then begin
      Control := TStyledControl(Comp);

      if Control.Visible or IncInvisibleLinks then begin
        if LowerCase(Control.StyleLookup) = 'backtoolbutton' then begin
          // Check for Action
          Action := Control.GetFMXAction;
          if Assigned(Action) then begin
            if Action is TChangeTabAction then
              Exit(TChangeTabAction(Action));
          end;
        end;
      end;
    end;

    if Comp is TTabControl then
      Result := FindBackAction(TTabControl(Comp),IncInvisibleLinks)
    else
      Result := FindBackAction(Comp,IncInvisibleLinks);

    if Assigned(Result) then
      Exit;
  end;
end;

{ TActionHelper }

function TActionHelper.GetFMXAction: TBasicAction;
begin
  Result := Self.GetAction;
end;

end.
