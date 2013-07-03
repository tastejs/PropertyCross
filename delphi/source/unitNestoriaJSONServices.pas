//---------------------------------------------------------------------------
// This software is Copyright (c) 2013 Embarcadero Technologies, Inc.
// www.embarcadero.com
//
// This is example source code, provided as is and without warranty.
// You may only use this software if you are an authorized licensee
// of Delphi, C++Builder or RAD Studio (Embarcadero Products).
//---------------------------------------------------------------------------

unit unitNestoriaJSONServices;

interface

uses unitNestoriaObjects, unitNestoriaSearchTypes, Data.JSON.Intf;

type
  TNestoriaJSONServices = class
  public
    class function LoadProperty(const SourceNode : IJSONNode): TNestoriaProperty; overload; static;
    class function LoadSearchJSON(const strJSON: string; var LastSearchConfig: TNestoriaLastSearchConfig): TNestoriaSearchResult;
  end;

implementation

uses System.SysUtils, Data.JSON.Objs;

{ TNestoriaJSONServices }

class function TNestoriaJSONServices.LoadSearchJSON(const strJSON: string; var LastSearchConfig: TNestoriaLastSearchConfig): TNestoriaSearchResult;
var
  JSONDocument1: TJSONParser;
  ResponseNode, CurrNode : IJSONNode;
  Prop : TNestoriaProperty;
  AmbiguousLocation: TNestoriaSearchResult.TAmbiguousLocation;
  ResponseCode : Integer;
  I: Integer;
  Intf: IJSONDocument;
begin
  JSONDocument1 := TJSONParser.Create(nil);
  Intf := JSONDocument1; // Need this because no owner
  try
    JSONDocument1.JSONText := strJSON;
    JSONDocument1.LoadOptions := [TJSONLoadOption.jloLoadArrayAsChildObjectsOfParent];
    JSONDocument1.Active := True;

    Result := TNestoriaSearchResult.Create();

    // Check Search Result and then respond accordingly.
    // Listings are in the Response-Listings node.
    // 100, 101, 110 = List of properties
    // 200, 202 = Ambiguous (suggestions of what you mean returned)
    // All others = error.
    try
      ResponseNode := JSONDocument1.DocumentElement.ChildNodes.FindNode('response');

      ResponseCode := ResponseNode.Attributes['application_response_code'];
      if ResponseNode.HasAttribute('application_response_text') then
        Result.ApplicationMessage := ResponseNode.Attributes['application_response_text'];

      // If the page has been fetched OK, update the page we are on.
      if ResponseNode.HasAttribute('page') then
        LastSearchConfig.CurrentPage := ResponseNode.Attributes['page'];

      if ResponseNode.HasAttribute('total_results') then
        LastSearchConfig.TotalRecords := ResponseNode.Attributes['total_results'];
      Result.TotalRecordsForSearch := LastSearchConfig.TotalRecords;

      case ResponseCode of
        100, 101,
        110, 111      : begin
                          Result.Result := nrtOK;
                          for I := 0 to Pred(ResponseNode.ChildNodes.Count) do begin
                            CurrNode := ResponseNode.ChildNodes.Nodes[I];

                            if CurrNode.NodeName <> 'listings' then
                              Continue;

                            try
                              Prop := TNestoriaJSONServices.LoadProperty(CurrNode);
                              Result.AddProperty(Prop);
                            except
                              Result.Result := TNestoriaSearchResultType.nrtError;
                              Result.ApplicationMessage := 'Error Loading - Invalid data recieved from server for GUID '+CurrNode.Attributes['guid'];
                            end;
                          end;

                        end;
        200, 202      : begin
                          Result.Result := nrtAmbiguous;

                          for I := 0 to Pred(ResponseNode.ChildNodes.Count) do begin
                            CurrNode := ResponseNode.ChildNodes.Nodes[I];

                            if CurrNode.NodeName <> 'locations' then
                              Continue;

                            AmbiguousLocation := TNestoriaSearchResult.TAmbiguousLocation.Create;
                            try
                              AmbiguousLocation.ID := CurrNode.Attributes['place_name'];
                              AmbiguousLocation.Location := CurrNode.Attributes['long_title'];
                              Result.AddAmbiguousLocation(AmbiguousLocation);
                            except
                              AmbiguousLocation.Free;
                            end;
                          end;
                        end
        else            begin
                          Result.Result := nrtError;
                          Exit;
                        end;
      end;

    except
      on e:exception do begin
        Result.Result := TNestoriaSearchResultType.nrtError;
        // need to update this, but set for debugging.
        Result.ApplicationMessage := e.Message;
      end;
    end;
  finally
    Intf := nil;
  end;

end;

class function TNestoriaJSONServices.LoadProperty(
  const SourceNode: IJSONNode): TNestoriaProperty;
begin
  Result := TNestoriaProperty.Create;
  try
    if SourceNode.HasAttribute('guid') then
      Result.GUID := SourceNode.Attributes['guid'];
    if SourceNode.HasAttribute('thumb_url') then
      Result.ThumbURL := SourceNode.Attributes['thumb_url'];
    if SourceNode.HasAttribute('title') then
      Result.Title := SourceNode.Attributes['title'];

    if SourceNode.HasAttribute('price_currency') then begin
      if SourceNode.Attributes['price_currency'] = 'GBP' then
        Result.Price := '£'+ FormatFloat('0,00',SourceNode.Attributes['price'])
      else
        Result.Price := SourceNode.Attributes['price_formatted'];
    end;

    if SourceNode.HasAttribute('img_url') then
      Result.ImageURL  := SourceNode.Attributes['img_url'];
    if SourceNode.HasAttribute('bedroom_number') then
      Result.Bedrooms  := SourceNode.Attributes['bedroom_number'];
    if SourceNode.HasAttribute('bathroom_number') then
      Result.Bathrooms := SourceNode.Attributes['bathroom_number'];
    if SourceNode.HasAttribute('summary') then
      Result.Summary   := SourceNode.Attributes['summary'];
  except
    Result.Free;
    raise;
  end;
end;


end.
