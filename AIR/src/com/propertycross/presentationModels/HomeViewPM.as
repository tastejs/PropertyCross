package com.propertycross.presentationModels
{
    import com.propertycross.controllers.RecentSearchesController;

    import com.propertycross.events.SearchEvent;

    import flash.events.GeolocationEvent;
    import flash.sensors.Geolocation;

    import com.propertycross.models.Location;

    import mx.collections.ArrayList;
    import mx.collections.IList;

    import spark.formatters.NumberFormatter;
    import spark.managers.PersistenceManager;

    import com.propertycross.views.FavouritesView;
    import com.propertycross.views.SearchResultsView;

    [Event(name="search", type="com.propertycross.events.SearchEvent")]

    [ManagedEvents("search")]
    public class HomeViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Class Variables
        //
        //------------------------------------

        private var _geolocation:Geolocation;
        private var _formatter:NumberFormatter;


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function HomeViewPM()
        {
            _formatter = new NumberFormatter();
            _formatter.fractionalDigits = 2
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  recentSearchesController
        //----------------------------------

        [Inject]
        public var recentSearchesController:RecentSearchesController;

        //----------------------------------
        //  location
        //----------------------------------

        [Bindable]
        public var locationName:String;

        //----------------------------------
        //  recentSearches
        //----------------------------------

        public function get recentSearches():IList
        {
            return recentSearchesController ? recentSearchesController.searches : null;
        }

        //----------------------------------
        //  canSearchMyLocation
        //----------------------------------

        public function get canSearchMyLocation():Boolean
        {
            return Geolocation.isSupported;
        }


        //------------------------------------
        //
        //  Methods
        //
        //------------------------------------

        public function goToFavourites():void
        {
            if (!navigator)
            {
                return;
            }
            navigator.pushView(FavouritesView);
        }

        public function executeSearch(location:Location = null):void
        {
            if (!navigator)
            {
                return;
            }
            dispatchEvent(new SearchEvent(location ? location.name : locationName));
            navigator.pushView(SearchResultsView);
        }

        public function searchMyLocation():void
        {
            if (_geolocation)
            {
                return;
            }
            _geolocation = new Geolocation();
            _geolocation.addEventListener(GeolocationEvent.UPDATE,
                                          onGeolocationUpdate);
            _geolocation.setRequestedUpdateInterval(100);
        }

        private function onGeolocationUpdate(event:GeolocationEvent):void
        {
            var name:String = _formatter.format(event.latitude)
                            + ", "
                            + _formatter.format(event.longitude);
            executeSearch(new Location(name));
        }
    }
}