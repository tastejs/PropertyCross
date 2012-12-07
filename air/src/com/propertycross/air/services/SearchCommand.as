package com.propertycross.air.services
{
    import com.propertycross.air.events.SearchEvent;
    import com.propertycross.air.models.Location;
    import com.propertycross.air.models.Property;
    import com.propertycross.air.models.SearchResult;

    import flash.events.ErrorEvent;

    import mx.collections.ArrayCollection;
    import mx.collections.ListCollectionView;
    import mx.rpc.AsyncToken;
    import mx.rpc.Fault;
    import mx.rpc.events.FaultEvent;
    import mx.rpc.http.HTTPService;

    public class SearchCommand
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const GENERAL_ERROR:String =
            "An error occurred while searching. Please check your network connection and try again";
        private static const NOT_RECOGNISED:String =
            "The location given was not recognised";

        private static const VALID_RESPONSE_CODES:Array = [ "100", "101", "110", "200", "202" ];


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function execute(event:SearchEvent):AsyncToken
        {
            var service:HTTPService = new HTTPService();
            service.url = "http://api.nestoria.co.uk/api";
            service.request = { country: "uk",
                                pretty: "1",
                                action: "search_listings",
                                encoding: "json",
                                listing_type: "buy",
                                page: event.page,
                                place_name: event.location };
            return service.send();
        }

        public function result(json:String):SearchResult
        {
            var result:Object = JSON.parse(json);
            if (VALID_RESPONSE_CODES.indexOf(result.response.status_code) == -1)
            {
                throw new Error(GENERAL_ERROR);
            }
            var properties:Array = result.response.listings ? result.response.listings.map(asProperty) : [];
            var locations:Array = result.response.locations ? result.response.locations.map(asLocation) : [];
            var totalResults:Number = result.response.total_results;
            var page:uint = parseInt(result.response.page);
            return new SearchResult(properties, locations, totalResults, page);
        }

        public function error(fault:Fault):void
        {
            throw new Error(GENERAL_ERROR);
        }

        private static function asProperty(item:Object, index:int, array:Array):Property
        {
            return new Property(item.guid,
                                parseFloat(item.price),
                                parseInt(item.bedroom_number),
                                parseInt(item.bathroom_number),
                                item.property_type,
                                item.title,
                                item.summary,
                                item.thumb_url,
                                item.img_url);
        }

        private static function asLocation(item:Object, index:int, array:Array):Location
        {
            return new Location(item.place_name, item.long_title);
        }
    }
}