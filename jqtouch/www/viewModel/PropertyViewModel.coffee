define ["cs!util/formatBindings"], (ko) ->
    props = ["guid", "title", "price", "property_type",
                "img_url", "thumb_url", "summary", "bedroom_number",
                "bathroom_number", "latitude", "longitude"]       
    class PropertyViewModel
        # Given an listing from the Nestoria API, constructs a Property View Model for it.
        # Note: functions in constructor to allow default serialization to work..
        constructor: (property, appVM) ->
            @[prop] = ko.observable property[prop] for prop in props
            @favourite = ko.computed  ->
                for fave in appVM.favourites()
                    if fave.guid() is @guid()
                        return true
                false
            , this
            @toggleInFavourites = ->
                if @favourite()
                    self = this
                    appVM.favourites.remove (item) -> item.guid() is self.guid()
                    return
                appVM.favourites.unshift this