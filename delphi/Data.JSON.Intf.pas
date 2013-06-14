//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit Data.JSON.Intf;

interface

uses System.SysUtils, System.Classes;

type
  { Forward Declarartions }

  IJSONNode = interface;
  IJSONNameValue = interface;
  IJSONNodeList = interface;
  //IJSONNodeCollection = interface;
  IJSONDocument = interface;

{ EJSONDocError }

  EJSONDocError = class(Exception)
  end;

  IJSONNameValue = interface
    ['{8DD2D8B2-381E-45E1-BF25-8ECC41092D59}']
    function GetName: string;
    function GetValue: Variant;
    procedure SetName(const AValue: string);
    procedure SetValue(const AValue: Variant);
    { public }
    property Name: string read GetName write SetName;
    property Value: Variant read GetValue write SetValue;
  end;

  IJSONNode = interface
    ['{CAD0BFA2-D989-4EC4-897C-885601FF6802}']
    { Property Accessors }
    function GetNodeName: string;
    function GetNodeValue: Variant;
    procedure SetNodeValue(const Value :Variant);
    function GetAttribute(const AttrName: string): Variant;
    procedure SetAttribute(const AttrName: string; const Value: Variant);
    function GetAttributeNodes: IJSONNodeList;
    function GetHasChildNodes: Boolean;
    function GetChildNodes: IJSONNodeList;
    function GetChildValue(const IndexOrName: Variant): Variant;
    procedure SetChildValue(const IndexOrName: Variant; const Value: Variant);
    // function GetCollection: IJSONNodeCollection;
    function GetOwnerDocument: IJSONDocument;
    function GetIsTextElement: Boolean;
    function GetParentNode: IJSONNode;
    // function GetJSON: string;
    // function GetText: string;
    // procedure SetText(const value : string);

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

    // property Collection: IJSONNodeCollection read GetCollection;

    property OwnerDocument: IJSONDocument read GetOwnerDocument;
    property ParentNode: IJSONNode read GetParentNode;

    property IsTextElement: Boolean read GetIsTextElement;
    // property NodeType: TJSONNodeType read GetNodeType;
    // property Text: string read GetText write SetText;
    // property JSON: string read GetJSON;
  end;

  IJSONNodeList = interface
    ['{5B06A7A5-C3C6-4F92-BCDE-A936E4B39CD2}']
    { Property Accessors }
    function GetCount: Integer;
    function GetNode(const Index: Integer): IJSONNode;
    { Public properties }
    procedure Clear;
    procedure Delete(const Index: Integer);
    function Remove(const Node: IJSONNode): Integer;
    property Count: Integer read GetCount;
    property Nodes[const Index: Integer]: IJSONNode read GetNode; default;

    function First: IJSONNode;
    function Add(const Node: IJSONNode): Integer;
    function FindNode(const NodeName: string): IJSONNode; overload;
    function Last: IJSONNode;
    function ReplaceNode(const OldNode, NewNode: IJSONNode): IJSONNode;
    function Contains(const Node: IJSONNode): Boolean;
    function Extract(const Node: IJSONNode): IJSONNode;
  end;

//  IJSONNodeCollection = interface
//    ['{A0EEFA24-4CE1-490C-B962-E1C3A692DD3F}']
//    { Property Accessors }
//    function GetCount: Integer;
//    function GetNode(Index: Integer): IJSONNode;
//    { Public properties }
//    procedure Clear;
//    procedure Delete(Index: Integer);
//    function Remove(const Node: IJSONNode): Integer;
//    property Count: Integer read GetCount;
//    property Nodes[Index: Integer]: IJSONNode read GetNode; default;
//  end;

  IJSONDocument = interface
    ['{735145C5-411B-4F0E-AECD-097411028F9B}']
    { Property Accessors }
    function GetDocumentElement: IJSONNode;
    { Public properties }
    property DocumentElement : IJSONNode read GetDocumentElement;
  end;

implementation

end.
