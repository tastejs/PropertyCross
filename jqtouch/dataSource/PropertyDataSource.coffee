define ["lib/zepto"], ($) ->
    class PropertyDataSource
        ###
            Asychronously returns an object which contains a "response" which is
            one of: "OK", "AMBIGUOUS", "UNKNOWN" or "ERROR" together with the
            "listing" or "locations" based on whether it worked.
        ###
        findProperties: (placeNameOrCoords, pageNumber, callback) ->
            #Note: place_name takes precedence if non-empty otherwise centre_point used..
            placeName = if placeNameOrCoords.latitude and placeNameOrCoords.longitude then "" else placeNameOrCoords
            $.ajax
                dataType: "jsonp"
                data:
                    country: "uk"
                    pretty: "1"
                    encoding: "json"
                    listing_type: "buy"
                    action: "search_listings"
                    page: pageNumber
                    place_name: placeName
                    centre_point: "#{placeNameOrCoords.latitude},#{placeNameOrCoords.longitude}"
                url: "http://api.nestoria.co.uk/api"
                timeout: 5000
                success: (result) ->
                    response = result.response
                    responseCode = response.application_response_code
                    toGiveBack
                    switch responseCode
                        when "100", "101", "110"
                            toGiveBack =
                                listings: response.listings
                                location: response.locations[0]
                                total_results: response.total_results
                                response: "OK"
                        else
                            if response.locations?.length and response.locations[0].long_title
                                toGiveBack =
                                    locations: response.locations
                                    response: "AMBIGUOUS"
                            else
                                toGiveBack = response: "UNKNOWN"
                    callback toGiveBack
                error: ->
                    callback response: "ERROR"
