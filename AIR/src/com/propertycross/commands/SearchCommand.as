package com.propertycross.commands
{
    import com.propertycross.events.SearchEvent;
    import com.propertycross.models.Property;
    import com.propertycross.models.SearchResult;

    import mx.collections.ArrayCollection;
    import mx.collections.ListCollectionView;
    import mx.rpc.AsyncToken;
    import mx.rpc.http.HTTPService;

    public class SearchCommand
    {
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
                                page: 1,
                                place_name: event.location };
            return service.send();
        }

        public function result(json:String):SearchResult
        {
            var result:Object = JSON.parse(json);
            var properties:Array = result.response.listings.map(asProperty);
            var totalResults:Number = result.response.total_results;
            return new SearchResult(properties, totalResults);
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
    }
}