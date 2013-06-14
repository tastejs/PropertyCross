object dtmdlNestoria: TdtmdlNestoria
  OldCreateOrder = False
  OnCreate = DataModuleCreate
  Height = 151
  Width = 446
  object cdsSearches: TClientDataSet
    Aggregates = <>
    FieldDefs = <>
    IndexDefs = <
      item
        Name = 'cdsSearchsIndexByDateDesc'
        Fields = 'SEARCH_DATE_TIME'
        Options = [ixDescending]
      end>
    IndexName = 'cdsSearchsIndexByDateDesc'
    Params = <>
    StoreDefs = True
    Left = 24
    Top = 24
    object cdsSearchesLOCATION: TStringField
      FieldName = 'LOCATION'
      Size = 255
    end
    object cdsSearchesID: TStringField
      FieldName = 'ID'
      Size = 50
    end
    object cdsSearchesLatitude: TFloatField
      FieldName = 'Latitude'
    end
    object cdsSearchesLongitude: TFloatField
      FieldName = 'Longitude'
    end
    object cdsSearchesSEARCH_DATE_TIME: TDateTimeField
      FieldName = 'SEARCH_DATE_TIME'
    end
  end
  object cdsAmbiguousSearchs: TClientDataSet
    Aggregates = <>
    Params = <>
    Left = 136
    Top = 24
    object cdsAmbiguousSearchsLOCATION: TStringField
      FieldName = 'LOCATION'
      Size = 255
    end
    object cdsAmbiguousSearchsID: TStringField
      FieldName = 'ID'
      Size = 50
    end
  end
  object cdsFavourates: TClientDataSet
    Aggregates = <>
    Params = <>
    Left = 248
    Top = 24
    object cdsFavouratesGUID: TStringField
      DisplayWidth = 50
      FieldName = 'GUID'
      Size = 50
    end
    object cdsFavouratesPrice: TStringField
      FieldName = 'Price'
    end
    object cdsFavouratesTitle: TStringField
      FieldName = 'Title'
      Size = 255
    end
    object cdsFavouratesThumbImage: TGraphicField
      FieldName = 'ThumbImage'
      BlobType = ftGraphic
    end
    object cdsFavouratesBedrooms: TStringField
      FieldName = 'Bedrooms'
    end
    object cdsFavouratesBathrooms: TStringField
      FieldName = 'Bathrooms'
    end
    object cdsFavouratesSummary: TStringField
      FieldName = 'Summary'
      Size = 255
    end
    object cdsFavouratesThumbURL: TStringField
      FieldName = 'ThumbURL'
      Size = 255
    end
    object cdsFavouratesImageURL: TStringField
      FieldName = 'ImageURL'
      Size = 255
    end
    object cdsFavouratesImage: TGraphicField
      FieldName = 'Image'
      BlobType = ftGraphic
    end
    object cdsFavouratesDetailTitle: TStringField
      FieldName = 'DetailTitle'
      Size = 255
    end
  end
  object pbsSearchResults: TPrototypeBindSource
    AutoActivate = True
    AutoEdit = False
    AutoPost = False
    FieldDefs = <
      item
        Name = 'ThumbImage'
        FieldType = ftBitmap
        Generator = 'ContactBitmaps'
        ReadOnly = True
      end
      item
        Name = 'Price'
        Generator = 'ContactTitles'
        ReadOnly = True
      end
      item
        Name = 'DetailTitle'
        Generator = 'LoremIpsum'
        ReadOnly = True
      end
      item
        Name = 'Image'
        FieldType = ftBitmap
        Generator = 'ContactBitmaps'
        ReadOnly = True
      end
      item
        Name = 'RoomsText'
        Generator = 'Integers'
        ReadOnly = False
      end
      item
        Name = 'Summary'
        Generator = 'LoremIpsum'
        ReadOnly = False
      end
      item
        Name = 'GUID'
        ReadOnly = False
      end
      item
        Name = 'Title'
        Generator = 'BitmapNames'
        ReadOnly = False
      end>
    ScopeMappings = <>
    OnCreateAdapter = pbsSearchResultsCreateAdapter
    Left = 344
    Top = 24
  end
end
