define [], ->
    class Search
        # Constructs a search object from the given object..
        constructor: (search) ->
            props = ["long_title", "place_name", "count", "searchTimeMS"]
            @[prop] = search[prop] for prop in props
            @searchTimeMS ?= new Date().getTime()
