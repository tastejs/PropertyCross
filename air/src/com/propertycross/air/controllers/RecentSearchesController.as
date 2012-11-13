package com.propertycross.air.controllers
{
    import com.propertycross.air.events.SearchEvent;
    import com.propertycross.air.models.Location;
    import com.propertycross.air.models.SearchResult;

    import flash.events.EventDispatcher;

    import mx.collections.ArrayCollection;
    import mx.collections.IList;

    import spark.managers.PersistenceManager;

    public class RecentSearchesController extends EventDispatcher
    {
        //------------------------------------
        //
        //  Constants
        //
        //------------------------------------

        private static const RECENT_SEARCHES:String = "recentSearches";


        //------------------------------------
        //
        ///  Class Variables
        //
        //------------------------------------

        private var _persistenceManager:PersistenceManager;


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function RecentSearchesController()
        {
            _persistenceManager = new PersistenceManager();
            _persistenceManager.load();
            _searches = getRecentSearchesFromLocalStorage();
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  searches
        //----------------------------------

        private var _searches:IList;
        public function get searches():IList
        {
            return _searches;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        [CommandResult]
        public function onPropertySearchResult(result:SearchResult,
                                               event:SearchEvent):void
        {
            if (result.ambiguousLocation)
            {
                return;
            }
            var search:Location = result.locations[0];
            search.totalResults = result.totalResults;
            // check the search hasn't already been stored
            for each (var location : Location in _searches)
            {
                if (location.name == search.name)
                {
                    location.totalResults = search.totalResults;
                    return;
                }
            }
            _searches.addItemAt(search, 0);
            _persistenceManager.setProperty(RECENT_SEARCHES,
                                            JSON.stringify(_searches.toArray()));
        }

        private function getRecentSearchesFromLocalStorage():IList
        {
            var searchesJSON : String =
                _persistenceManager.getProperty(RECENT_SEARCHES) as String;
            if ( !searchesJSON )
            {
                return new ArrayCollection();
            }
            var searchesArray : Array = JSON.parse(searchesJSON) as Array;
            return new ArrayCollection(searchesArray.map(asLocation));
        }

        private static function asLocation(item:Object,
                                           index:int,
                                           array:Array):Location
        {
            return new Location(item.id, item.name, item.totalResults);
        }
    }
}