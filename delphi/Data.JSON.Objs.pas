//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit Data.JSON.Objs;

interface

uses Data.JSON.Tokenizer, Data.JSON.Intf, System.Classes, Data.DBXJSON,
  System.Generics.Collections;

type
  // - Forward declaration of classes -
  // - Helper classes for the Interface
  TJSONNodeHelper = class;
  TJSONNodeListHelper = class;
  TJSONNameValueHelper = class;
  // - Main Classes
  TJSONParser = class;
  TJSONNode = class;
  TJSONNodeList = class;
  TJSONNameValue = class;

  ///	<remarks>
  ///	  Helper type for creating a function that returns the string value
  ///	</remarks>
  TJSON_StringFunc = reference to function(): string;
  ///	<remarks>
  ///	  Helper type for creating a procedure that passes a string value
  ///	</remarks>
  TJSON_StringProc = reference to procedure(const aValue : string);
  ///	<remarks>
  ///	  Helper type for creating a function that returns the string value
  ///	</remarks>
  TJSON_VariantFunc = reference to function(): Variant;
  ///	<remarks>
  ///	  Helper type for creating a procedure that passes a value
  ///	</remarks>
  TJSON_VariantProc = reference to procedure(const aValue : Variant);
  ///	<remarks>
  ///	  Helper type for creating a function that returns the TJSON_IJSONNodeFunc value
  ///	</remarks>
  TJSON_IJSONNodeFunc = reference to function(): IJSONNode;
  ///	<remarks>
  ///	  Helper type for creating a function that returns the IJSONDocument value
  ///	</remarks>
  TJSON_IJSONDocumentFunc = reference to function(): IJSONDocument;
  ///	<remarks>
  ///	  Helper type for creating a function that returns the IJSONNodeList value
  ///	</remarks>
  TJSON_IJSONNodeListFunc = reference to function(): IJSONNodeList;


  TJSONLoadOption = (
    ///	<summary>
    ///	  jloLoadArrayAsChildObjectsOfParent controls where nodes are added when
    ///	  loading an array. When used the nodes are loaded directly to the parent
    ///	  of the array. When not used (default) a node is created for the array and
    ///	  each element added to that node.
    ///	</summary>
    jloLoadArrayAsChildObjectsOfParent
  );

  TJSONLoadOptions = set of TJSONLoadOption;

  ///	<remarks>
  ///	  <para>
  ///	    TJSONParser implements IJSONDocument to read and process JSON into a
  ///	    set of Nodes for navigation via IJSONNode, IJSONNodeList
  ///	  </para>
  ///	  <para>
  ///	    Use DocumentElelement property to get the root node
  ///	  </para>
  ///	</remarks>
  TJSONParser = class(TComponent, IJSONDocument)
  strict private
    FReader : TJSONTokenizer;
    FRootNode : IJSONNode;
    FLoadingNode : IJSONNode;
    FCurrentlyLoadingArrayList : IJSONNodeList;

    procedure InternalOnParseToken(const Token: TJSONToken);
    procedure InternalOnParseFinish(Sender : TObject);
    procedure InternalOnChange;
  private
    FLoadOptions: TJSONLoadOptions;
    function GetActive: boolean;
    function GetJSONText: string;
    procedure SetActive(const Value: boolean);
    procedure SetJSONText(const Value: string);
    function GetDocumentElement: IJSONNode;
    procedure SetLoadOptions(const Value: TJSONLoadOptions);
  public
    constructor Create(AOwner : TComponent); reintroduce;
    destructor Destroy; override;
  published
    property DocumentElement : IJSONNode read GetDocumentElement;
    property Active: boolean read GetActive write SetActive default false;
    property JSONText: string read GetJSONText write SetJSONText;
    property LoadOptions : TJSONLoadOptions read FLoadOptions write SetLoadOptions;
  end;


  ///	<remarks>
  ///	  TJSONNodeList is an implementation of IJSONNodeList for managing a list
  ///	  of IJSONNode, uses TJSONNodeListHelper internally
  ///	</remarks>
  TJSONNodeList = class(TObject,IJSONNodeList)
  strict private
    FIJSONNodeList: IJSONNodeList;
  public
    constructor Create(AOwnsObjects : Boolean);
  published
    property JSONNode : IJSONNodeList read FIJSONNodeList implements IJSONNodeList;
  end;


  TJSONNodeListHelper = class(TInterfacedObject, IJSONNodeList)
  strict private
    FList : TObjectList<TObject>;
  private
    function GetCount: Integer;
    function GetNode(const Index: Integer): IJSONNode;
  public
    { Public properties }
    constructor Create(AOwnsObjects : Boolean);
    destructor Destroy; override;
    procedure Clear;
    procedure Delete(const Index: Integer);
    function Remove(const Node: IJSONNode): Integer;
    function Contains(const Node: IJSONNode): Boolean;
    function Extract(const Node: IJSONNode): IJSONNode;
    property Count: Integer read GetCount;
    property Nodes[const Index: Integer]: IJSONNode read GetNode; default;
    function First: IJSONNode;
    function Add(const Node: IJSONNode): Integer;
    function FindNode(const NodeName: string): IJSONNode; overload;
    function Last: IJSONNode;
    function ReplaceNode(const OldNode, NewNode: IJSONNode): IJSONNode;

  end;


  ///	<remarks>
  ///	  <para>
  ///	    TJSONNode implements TJSONNodeHelper to implement IJSONNode.
  ///	  </para>
  ///	  <para>
  ///	    TJSONNode uses TJSONNodeList by default for list management, but can
  ///	    be updated at run time to use any other implementation of
  ///	    IJSONNodeList via the AttriubteNodeList and ChildNodeList properties.
  ///	  </para>
  ///	  <para>
  ///	    Values are stored in ValueManager, which can be updated via a new 
  ///	    IJSONNameValue object
  ///	  </para>
  ///	</remarks>
  TJSONNode = class(TObject, IJSONNode, IJSONNameValue)
  strict private
    // Internal Pointer for the Interface Implementation
    FIJSONNode_Ptr : IJSONNode;
    // Internal Value holders
    FAttributes,
    FChildNodes : IJSONNodeList;
    FOwnerDocument : IJSONDocument;
    FParentNode : IJSONNode;
    FValueManager : IJSONNameValue;
    procedure SetValueManager(const Value: IJSONNameValue);
    procedure SetAttributeNodeList(const Value: IJSONNodeList);
    procedure SetChildNodeList(const Value: IJSONNodeList);
  public
    constructor Create(AOwnerDocument : IJSONDocument; AParentNode : IJSONNode; ANodeName: string); reintroduce; overload;
    constructor Create(AOwnerDocument : IJSONDocument; AParentNode : IJSONNode; ANodeName: string; ANodeValue : Variant);  reintroduce; overload;
    destructor Destroy; override;
    property JSONNode : IJSONNode read FIJSONNode_Ptr implements IJSONNode;
    property ValueManager : IJSONNameValue read FValueManager write SetValueManager implements IJSONNameValue;
    property AttributeNodeList : IJSONNodeList read FAttributes write SetAttributeNodeList;
    property ChildNodeList : IJSONNodeList read FChildNodes write SetChildNodeList;
  end;

  TJSONNodeHelper = class(TInterfacedObject, IJSONNode)
  private
    FOwnerDocument_Func : TJSON_IJSONDocumentFunc;
    FParentNode_Func : TJSON_IJSONNodeFunc;
    FNodeNameValue : IJSONNameValue;
    FAttributes,
    FChildNodes : TJSON_IJSONNodeListFunc;

    function GetAttribute(const AttrName: string): Variant;
    function GetAttributeNodes: IJSONNodeList;
    function GetChildNodes: IJSONNodeList;
    function GetChildValue(const IndexOrName: Variant): Variant;
    //function GetCollection: IJSONNodeList;
    function GetHasChildNodes: Boolean;
    function GetIsTextElement: Boolean;
    function GetNodeName: string; //
    function GetNodeValue: Variant; //
    function GetOwnerDocument: IJSONDocument; //
    function GetParentNode: IJSONNode; //
    procedure SetAttribute(const AttrName: string; const Value: Variant);
    procedure SetChildValue(const IndexOrName, Value: Variant);
    procedure SetNodeValue(const Value: Variant);
  public
    constructor Create(AOwnerDocument : TJSON_IJSONDocumentFunc; AParentNode : TJSON_IJSONNodeFunc; AJSONNameValue: IJSONNameValue; AAttributes, AChildNodes : TJSON_IJSONNodeListFunc); reintroduce;
    destructor Destroy; override;

    { public functions }
    function HasAttribute(const Name: string): Boolean; overload;

    { Public properties }
    property NodeName: string read GetNodeName;
    property NodeValue: Variant read GetNodeValue write SetNodeValue;

    property Attributes[const AttrName: string]: Variant read GetAttribute write SetAttribute;
    property AttributeNodes: IJSONNodeList read GetAttributeNodes;

    property HasChildNodes: Boolean read GetHasChildNodes;
    property ChildNodes: IJSONNodeList read GetChildNodes;
    property ChildValues[const IndexOrName: Variant]: Variant read GetChildValue write SetChildValue; default;

    //property Collection: IJSONNodeList read GetCollection;

    property OwnerDocument: IJSONDocument read GetOwnerDocument;
    property ParentNode: IJSONNode read GetParentNode;

    property IsTextElement: Boolean read GetIsTextElement;
    // property JSON: string read GetJSON;
  end;

  TJSONNameValueHelper = class(TInterfacedObject, IJSONNameValue)
  private
    FName_Get : TJSON_StringFunc;
    FValue_Get : TJSON_VariantFunc;
    FName_Set : TJSON_StringProc;
    FValue_Set : TJSON_VariantProc;
    function GetName: string;
    function GetValue: Variant;
    procedure SetName(const AValue: string);
    procedure SetValue(const AValue: Variant);
  public
    constructor Create(AGetName : TJSON_StringFunc;
                       ASetName : TJSON_StringProc;
                       AGetValue : TJSON_VariantFunc;
                       ASetValue : TJSON_VariantProc);
    property Name: string read GetName write SetName;
    property Value: Variant read GetValue write SetValue;
  end;


  ///	<remarks>
  ///	  TJSONNameValue manages Name and Value pair. Internally it uses
  ///	  TJSONNameValueHelper to implement IJSONNameValue
  ///	</remarks>
  TJSONNameValue = class(TObject, IJSONNameValue)
  strict private
    FName : string;
    FValue : Variant;
    FIJSONNameValue: IJSONNameValue;
  public
    constructor Create(AName : string; AValue : Variant); reintroduce;
    property JSONNameValue : IJSONNameValue read FIJSONNameValue implements IJSONNameValue;
  end;


implementation

uses System.SysUtils, System.Variants;

{ TJSONParser }

constructor TJSONParser.Create(AOwner : TComponent);
begin
  inherited Create(AOwner);
  FRootNode := nil;
  FReader := TJSONTokenizer.Create(Self);
  FReader.OnToken := Self.InternalOnParseToken;
  FReader.OnFinish := Self.InternalOnParseFinish;
  FLoadOptions := [];
end;

destructor TJSONParser.Destroy;
begin
  FReader.Free;
  inherited;
end;

function TJSONParser.GetActive: boolean;
begin
  Result := FReader.Active;
end;

function TJSONParser.GetDocumentElement: IJSONNode;
begin
  Result := FRootNode;
end;

function TJSONParser.GetJSONText: string;
begin
  Result := FReader.JSONText;
end;

procedure TJSONParser.InternalOnChange;
begin
  FLoadingNode := nil;

  if FReader.Active then begin
    FReader.Tokenize;
  end else begin
    FRootNode := nil;
  end;
end;

procedure TJSONParser.InternalOnParseFinish(Sender: TObject);
begin
  FLoadingNode := nil;
end;

procedure TJSONParser.InternalOnParseToken(const Token: TJSONToken);
var
  ThisNode : TJSONNode;
  ParentNode : IJSONNode;
  I: Integer;
  LoopNode: IJSONNode;
begin
  if (Self.FRootNode = nil) and (Token.Kind = jsObjectStart) then begin
    Self.FRootNode := TJSONNode.Create(nil,nil,'Root');
    Self.FLoadingNode := Self.FRootNode;
    Exit;
  end;

  // Here is where the nodes get created....
  case Token.Kind of
// Values
    jsNumber     : FLoadingNode.NodeValue := StrToFloat(Token.Content);
    jsString     : FLoadingNode.NodeValue := Token.Content;
    jsTrue       : FLoadingNode.NodeValue := True;
    jsFalse      : FLoadingNode.NodeValue := False;
    jsNull       : FLoadingNode.NodeValue := null;

    jsPairStart  : begin
                     ThisNode := TJSONNode.Create(Self,FLoadingNode,Token.Content.DeQuotedString('"'));
                     FLoadingNode.AttributeNodes.Add(ThisNode);
                     Self.FLoadingNode := ThisNode;
                   end;
    jsPairEnd    : begin
                     // As the pair closes, if the Loading Node has no value, but has children, then move to children list
                     if VarIsNull(FLoadingNode.NodeValue) and Assigned(FLoadingNode.ParentNode) and
                       ((FLoadingNode.AttributeNodes.Count > 0) or (FLoadingNode.ChildNodes.Count > 0)) then begin
                       ParentNode := FLoadingNode.ParentNode;
                       if ParentNode.AttributeNodes.Contains(FLoadingNode) then begin
                         ParentNode.AttributeNodes.Extract(FLoadingNode);
                         ParentNode.ChildNodes.Add(FLoadingNode);
                       end;
                     end;
                     FLoadingNode := FLoadingNode.ParentNode;

                   end;
    jsArrayStart : begin
                     if FCurrentlyLoadingArrayList = nil then
                       FCurrentlyLoadingArrayList := TJSONNodeList.Create(False);

                     FCurrentlyLoadingArrayList.Add(FLoadingNode);
                   end;
    jsArrayEnd   : begin
                     FCurrentlyLoadingArrayList.Remove(Self.FLoadingNode);
                     if FCurrentlyLoadingArrayList.Count = 0 then
                       FCurrentlyLoadingArrayList := nil;

                     if TJSONLoadOption.jloLoadArrayAsChildObjectsOfParent in LoadOptions  then begin

                       // Need to move to parent.
                       // WTF - really an array with Attributes!!!
                       if Self.FLoadingNode.AttributeNodes.Count <> 0 then
                         Exit;

                       ParentNode := FLoadingNode.ParentNode;
                       // Remove tempory object for loading array. They should be Children of the same type - This matches the XML model
                       ParentNode.AttributeNodes.Extract(FLoadingNode);
                       for I := 0 to FLoadingNode.ChildNodes.Count -1 do begin
                         ParentNode.ChildNodes.Add(FLoadingNode.ChildNodes.Nodes[I]);
                       end;
                     end;
                   end;
    jsObjectStart: begin
                     //Ignore, unless in an array;
                     if Assigned(FCurrentlyLoadingArrayList) then begin
                       ThisNode := TJSONNode.Create(Self,FLoadingNode,FLoadingNode.NodeName);
                       FLoadingNode.ChildNodes.Add(ThisNode);
                       Self.FLoadingNode := ThisNode;
                     end;
                   end;
    jsObjectEnd  : begin
                     //Ignore, unless in an array;
                     if Assigned(FCurrentlyLoadingArrayList) then begin
                       if FCurrentlyLoadingArrayList.Contains(Self.FLoadingNode.ParentNode) then
                         Self.FLoadingNode := Self.FLoadingNode.ParentNode;
                     end;
                   end;
  end;
end;

procedure TJSONParser.SetActive(const Value: boolean);
begin
  // If Active, then all is good!!!
  if Value and (FReader.Active = Value) then
    Exit;

  FReader.Active := Value;
  InternalOnChange;
end;

procedure TJSONParser.SetJSONText(const Value: string);
begin
  FReader.JSONText := Value;
  if Active then
    InternalOnChange;
end;

procedure TJSONParser.SetLoadOptions(const Value: TJSONLoadOptions);
begin
  FLoadOptions := Value;
end;

{ TJSONNode }

constructor TJSONNodeHelper.Create(AOwnerDocument : TJSON_IJSONDocumentFunc;
  AParentNode : TJSON_IJSONNodeFunc; AJSONNameValue: IJSONNameValue; AAttributes, AChildNodes : TJSON_IJSONNodeListFunc);
begin
  inherited Create;
  FOwnerDocument_Func := AOwnerDocument;
  FParentNode_Func := AParentNode;
  FNodeNameValue := AJSONNameValue;
  FAttributes := AAttributes;
  FChildNodes := AChildNodes;
end;

destructor TJSONNodeHelper.Destroy;
begin
  inherited;
end;

function TJSONNodeHelper.GetAttribute(const AttrName: string): Variant;
var
  I: Integer;
  INode: IJSONNode;
begin
  for I := 0 to FAttributes.Count -1 do begin
    INode := FAttributes.Nodes[I];
    if INode.NodeName = AttrName then begin
      Exit(INode.NodeValue);
    end;
  end;
  // else
  Result := '';
end;

function TJSONNodeHelper.GetAttributeNodes: IJSONNodeList;
begin
  Result := FAttributes;
end;

function TJSONNodeHelper.GetChildNodes: IJSONNodeList;
begin
  Result := FChildNodes;
end;

function TJSONNodeHelper.GetChildValue(const IndexOrName: Variant): Variant;
var
  Node: IJSONNode;
begin
  Result := '';

  if VarIsOrdinal(IndexOrName) then
    Node := FChildNodes.GetNode(IndexOrName)
  else if VarIsStr(IndexOrName) then
    Node := FChildNodes.FindNode(IndexOrName)
  else
    Node := nil;

  if Node <> nil then
    Result := Node.NodeValue;
end;

function TJSONNodeHelper.GetHasChildNodes: Boolean;
begin
  Result := FChildNodes.Count > 0;
end;

function TJSONNodeHelper.GetIsTextElement: Boolean;
var
  S: string;
begin
  try
    S := Self.NodeValue; // Check it goes into a string
    Result := S > '';
  except
    Result := False;
  end;
end;

function TJSONNodeHelper.GetNodeName: string;
begin
  Result := FNodeNameValue.Name;
end;

function TJSONNodeHelper.GetNodeValue: Variant;
begin
  Result := FNodeNameValue.Value;
end;

function TJSONNodeHelper.GetOwnerDocument: IJSONDocument;
begin
  Result := FOwnerDocument_Func;
end;

function TJSONNodeHelper.GetParentNode: IJSONNode;
begin
  Result := FParentNode_Func;
end;

function TJSONNodeHelper.HasAttribute(const Name: string): Boolean;
var
  I: Integer;
  INode: IJSONNode;
begin
  Result := False;
  for I := 0 to FAttributes.Count -1 do begin
    INode := FAttributes.Nodes[I];
    if INode.NodeName = Name then
      Exit(True);
  end;
end;

procedure TJSONNodeHelper.SetAttribute(const AttrName: string; const Value: Variant);
var
  I: Integer;
  INode: IJSONNode;
begin
  for I := 0 to FAttributes.Count -1 do begin
    INode := FAttributes.Nodes[I];
    if INode.NodeName = AttrName then begin
      INode.NodeValue := Value;
      Exit;
    end;
  end;
end;

procedure TJSONNodeHelper.SetChildValue(const IndexOrName, Value: Variant);
var
  Node: IJSONNode;
begin
  if VarIsOrdinal(IndexOrName) then
    Node := FChildNodes.GetNode(IndexOrName)
  else if VarIsStr(IndexOrName) then
    Node := FChildNodes.FindNode(IndexOrName)
  else
    Node := nil;

  if Node <> nil then
    Node.NodeValue := Value;
end;

procedure TJSONNodeHelper.SetNodeValue(const Value: Variant);
begin
  FNodeNameValue.Value := Value;
end;

{ TJSONNode }

constructor TJSONNode.Create(AOwnerDocument: IJSONDocument;
  AParentNode: IJSONNode; ANodeName: string);
begin
  inherited Create;

  FAttributes := TJSONNodeList.Create(True);
  FChildNodes := TJSONNodeList.Create(True);

  FOwnerDocument := AOwnerDocument;
  FParentNode := AParentNode;

  FValueManager := TJSONNameValue.Create(ANodeName, null);

  FIJSONNode_Ptr := TJSONNodeHelper.Create(function : IJSONDocument
                                           begin
                                             Result := Self.FOwnerDocument;
                                           end,
                                           function : IJSONNode
                                           begin
                                             Result := Self.FParentNode;
                                           end,
                                           FValueManager,
                                           function : IJSONNodeList
                                           begin
                                             Result := FAttributes
                                           end,
                                           function : IJSONNodeList
                                           begin
                                             Result := FChildNodes;
                                           end
                                           );
end;

constructor TJSONNode.Create(AOwnerDocument: IJSONDocument;
  AParentNode: IJSONNode; ANodeName: string; ANodeValue: Variant);
begin
  Create(AOwnerDocument, AParentNode, ANodeName);
  FValueManager.Value := ANodeValue;
end;

destructor TJSONNode.Destroy;
begin
  FAttributes := nil;
  FChildNodes := nil;
  FOwnerDocument := nil;
  FParentNode := nil;
  FValueManager := nil;
  FIJSONNode_Ptr := nil;
  inherited;
end;

procedure TJSONNode.SetAttributeNodeList(const Value: IJSONNodeList);
begin
  Assert(Value <> nil);
  FAttributes := Value;
end;

procedure TJSONNode.SetChildNodeList(const Value: IJSONNodeList);
begin
  Assert(Value <> nil);
  FChildNodes := Value;
end;

procedure TJSONNode.SetValueManager(const Value: IJSONNameValue);
begin
  Assert(Value <> nil);
  FValueManager := Value;
end;

{ TJSONNodeList }

function TJSONNodeListHelper.Add(const Node: IJSONNode): Integer;
begin
  Assert(Node <> nil);
  Result := FList.Add(TObject(Node));
end;

procedure TJSONNodeListHelper.Clear;
begin
  FList.Clear;
end;

function TJSONNodeListHelper.Contains(const Node: IJSONNode): Boolean;
begin
  Result := FList.Contains(TObject(Node));
end;

constructor TJSONNodeListHelper.Create(AOwnsObjects: Boolean);
begin
  inherited Create;
  FList := TObjectList<TObject>.Create(AOwnsObjects);
end;

procedure TJSONNodeListHelper.Delete(const Index: Integer);
begin
  FList.Delete(Index);
end;

destructor TJSONNodeListHelper.Destroy;
begin
  FList.Free;
  inherited;
end;

function TJSONNodeListHelper.Extract(const Node: IJSONNode): IJSONNode;
var
  Obj: TObject;
begin
  Obj := FList.Extract(TObject(Node));
  Supports(Obj,IJSONNode,Result);
end;

function TJSONNodeListHelper.FindNode(const NodeName: string): IJSONNode;
var
  Obj: TObject;
  Node : IJSONNode;
begin
  for Obj in FList do begin
    Supports(Obj, IJSonNode, Node);
    if Node.NodeName = NodeName then
      Exit(Node);
  end;
end;

function TJSONNodeListHelper.First: IJSONNode;
var
  Obj: TObject;
begin
  Obj := FList.First;
  Supports(Obj, IJSonNode, Result);
end;

function TJSONNodeListHelper.GetCount: Integer;
begin
  Result := FList.Count;
end;

function TJSONNodeListHelper.GetNode(const Index: Integer): IJSONNode;
var
  Obj: TObject;
begin
  Obj := FList.Items[Index];
  Supports(Obj, IJSonNode, Result);
end;

function TJSONNodeListHelper.Last: IJSONNode;
var
  Obj: TObject;
begin
  if Count = 0 then
    Exit(nil);

  Obj := FList.Last;
  Supports(Obj, IJSonNode, Result);
end;

function TJSONNodeListHelper.Remove(const Node: IJSONNode): Integer;
begin
  Assert(Node <> nil);
  Result := FList.Remove(TObject(Node));
end;

function TJSONNodeListHelper.ReplaceNode(const OldNode,
  NewNode: IJSONNode): IJSONNode;
var
  OldN, NewN : TObject;
  WhereItWas: Integer;
begin
  OldN := TObject(OldNode);
  NewN := TObject(NewNode);
  WhereItWas := FList.IndexOf(OldN);

  Assert(NewN <> nil);
  Assert(WhereItWas >= 0);

  FList.Remove(OldN);
  FList.Insert(WhereItWas,NewN);
end;

{ TJSONNodeList }

constructor TJSONNodeList.Create(AOwnsObjects: Boolean);
begin
  inherited Create;
  FIJSONNodeList := TJSONNodeListHelper.Create(AOwnsObjects);
end;

{ TJSONNameValue }

constructor TJSONNameValueHelper.Create(AGetName: TJSON_StringFunc;
  ASetName: TJSON_StringProc; AGetValue: TJSON_VariantFunc;
  ASetValue: TJSON_VariantProc);
begin
  inherited Create;
  FName_Get  := AGetName;
  FValue_Get := AGetValue;
  FName_Set  := ASetName;
  FValue_Set := ASetValue;
end;

function TJSONNameValueHelper.GetName: string;
begin
  Result := FName_Get;
end;

function TJSONNameValueHelper.GetValue: Variant;
begin
  Result := FValue_Get;
end;

procedure TJSONNameValueHelper.SetName(const AValue: string);
begin
  FName_Set(AValue);
end;

procedure TJSONNameValueHelper.SetValue(const AValue: Variant);
begin
  FValue_Set(AValue);
end;

{ TJSONNameValue }

constructor TJSONNameValue.Create(AName: string; AValue: Variant);
begin
  inherited Create;
  FName := AName;
  FValue := AValue;
  FIJSONNameValue := TJSONNameValueHelper.Create( function : string
                                                  begin
                                                    Result := FName;
                                                  end,
                                                  procedure (const aValue : string)
                                                  begin
                                                    FName := aValue;
                                                  end,
                                                  function : Variant
                                                  begin
                                                    Result := FValue;
                                                  end,
                                                  procedure (const aValue : Variant)
                                                  begin
                                                    FValue := AValue;
                                                  end
                                                );
end;

end.