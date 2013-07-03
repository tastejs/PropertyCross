unit unitNestoriaXMLServices;

interface

uses unitNestoriaObjects, Xml.XMLIntf, unitNestoriaSearchTypes;

type
  TNestoriaXMLServices = class
  public
    class function LoadProperty(const SourceNode : IXMLNode): TNestoriaProperty; overload; static;
    class function LoadSearchXML(const strXML: string; var LastSearchConfig: TNestoriaLastSearchConfig): TNestoriaSearchResult;
  end;

implementation

uses System.SysUtils,
  Xml.xmldom, Xml.adomxmldom, Xml.XMLDoc;

{ TNestoriaXMLServices }

class function TNestoriaXMLServices.LoadSearchXML(const strXML: string; var LastSearchConfig: TNestoriaLastSearchConfig): TNestoriaSearchResult;
var
  XMLDocument1: TXMLDocument;
  ResponseNode, CurrNode : IXMLNode;
  Prop : TNestoriaProperty;
  AmbiguousLocation: TNestoriaSearchResult.TAmbiguousLocation;
  ResponseCode : Integer;
  I: Integer;
  Intf: IXMLDocument;
begin
  XMLDocument1 := TXMLDocument.Create(nil);
  Intf := XMLDocument1; // Need this because no owner
  try
    XMLDocument1.DOMVendor := XML.adomxmldom.OpenXML4Factory;
    XMLDocument1.LoadFromXML(strXml);
    XMLDocument1.Active := True;

    Result := TNestoriaSearchResult.Create();

    // Check Search Result and then respond accordingly.
    // Listings are in the Response-Listings node.
    // 100, 101, 110 = List of properties
    // 200, 202 = Ambiguous (suggestions of what you mean returned)
    // All others = error.
    try
      ResponseNode := XMLDocument1.DocumentElement.ChildNodes.FindNode('response');

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

  //                        pbsSearchResults.Active := False;
  //                        pbsSearchResults.AutoActivate := False;
                          try
                            for I := 0 to Pred(ResponseNode.ChildNodes.Count) do begin
                              CurrNode := ResponseNode.ChildNodes.Nodes[I];

                              if CurrNode.NodeName <> 'listings' then
                                Continue;
                              try
                                //Prop := TNestoriaProperty.Create(CurrNode);
                                Prop := TNestoriaXMLServices.LoadProperty(CurrNode);
                                Result.AddProperty(Prop);
                              except
                                Result.Result := TNestoriaSearchResultType.nrtError;
                                Result.ApplicationMessage := 'Error Loading - Invalid data recieved from server for GUID '+CurrNode.Attributes['guid'];
                              end;
                            end;
                          finally
  //                          pbsSearchResults.Active := True;
                          end;

                        end;
        200, 202      : begin
                          Result.Result := nrtAmbiguous;

  //                        cdsAmbiguousSearchs.Close;
  //                        cdsAmbiguousSearchs.CreateDataSet;
  //
  //                        cdsAmbiguousSearchs.DisableControls;
                          try
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

  //                            cdsAmbiguousSearchs.Append;
  //                            cdsAmbiguousSearchsLOCATION.AsString := CurrNode.Attributes['long_title'];
  //                            cdsAmbiguousSearchsID.AsString := CurrNode.Attributes['place_name'];
  //                            cdsAmbiguousSearchs.Post;
                            end;
                          finally
  //                          cdsAmbiguousSearchs.EnableControls;
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

class function TNestoriaXMLServices.LoadProperty(
  const SourceNode: IXMLNode): TNestoriaProperty;
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
