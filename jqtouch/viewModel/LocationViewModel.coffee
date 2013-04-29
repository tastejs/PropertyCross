define [], ->
    class LocationVM
        # Given an location from the Nestoria API, construct a new instance.
        constructor: (location, appVM) ->
            props = ["long_title", "place_name"]
            @[prop] = location[prop] for prop in props