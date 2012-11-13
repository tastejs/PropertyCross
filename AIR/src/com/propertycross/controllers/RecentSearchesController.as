package com.propertycross.controllers
{
    import com.propertycross.events.SearchEvent;
    import com.propertycross.models.Location;
    import com.propertycross.models.SearchResult;

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
            var search:Location = new Location(event.location, result.totalResults);
            for each (var location : Location in _searches)
            {
                if (location.name == search.name)
                {
                    return;
                }
            }
            _searches.addItem(search);
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
            return new Location(item.name, item.totalResults);
        }
    }
}