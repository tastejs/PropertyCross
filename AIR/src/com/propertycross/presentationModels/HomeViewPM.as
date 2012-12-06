package com.propertycross.presentationModels
{
    import com.propertycross.controllers.RecentSearchesController;
    import com.propertycross.events.SearchEvent;
    import com.propertycross.models.Location;
    import com.propertycross.models.SearchResult;
    import com.propertycross.views.FavouritesView;
    import com.propertycross.views.SearchResultsView;

    import flash.events.GeolocationEvent;
    import flash.events.TimerEvent;
    import flash.sensors.Geolocation;
    import flash.utils.Timer;

    import mx.collections.ArrayList;
    import mx.collections.IList;

    import spark.formatters.NumberFormatter;

    [Event(name="search", type="com.propertycross.events.SearchEvent")]

    [ManagedEvents("search")]
    public class HomeViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        public static const DEFAULT_STATE:String = "default";
        public static const ERROR_STATE:String = "error";
        public static const LOCATIONS_STATE:String = "locations";


        //------------------------------------
        //
        ///  Class Variables
        //
        //------------------------------------

        private var _formatter:NumberFormatter;
        private var _geolocation:Geolocation;
        private var _geoTimer:Timer;


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
        //  state
        //----------------------------------

        [Bindable]
        public var state:String = DEFAULT_STATE;

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
        //  error
        //----------------------------------

        [Bindable]
        public var error:String;

        //----------------------------------
        //  locations
        //----------------------------------

        [Bindable]
        public var locations:IList;

        //----------------------------------
        //  searching
        //----------------------------------

        [Bindable]
        public var searching:Boolean;


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

        [CommandResult]
        public function onPropertySearchResult(result:SearchResult,
                                               event:SearchEvent):void
        {
            error = null;
            if (result.ambiguousLocation)
            {
                locations = new ArrayList(result.locations);
                state = LOCATIONS_STATE;
            }
            else if (result.page == 1)
            {
                locations = null;
                state = DEFAULT_STATE;
                navigator.pushView(SearchResultsView);
            }
            searching = false;
        }

        [CommandError]
        public function onPropertySearchError(error:Error,
                                              event:SearchEvent):void
        {
            searching = false;
            // if not an initial search, not our concern
            if (event.page != 1)
            {
                return;
            }
            this.error = error.message;
            state = ERROR_STATE;
        }

        public function executeSearch(location:Location = null):void
        {
            if (!navigator)
            {
                return;
            }
            searching = true;
            this.error = null;
            state = DEFAULT_STATE;
            dispatchEvent(new SearchEvent(location ? location.id : locationName));
        }

        public function searchMyLocation():void
        {
            this.error = null;
            state = DEFAULT_STATE;
            if (!Geolocation.isSupported)
            {
                error = "The use of location is not supported on this device.";
                state = ERROR_STATE;
                return;
            }
            searching = true;
            _geolocation = new Geolocation();
            if (_geolocation.muted)
            {
                error = "The use of location is currently disabled.";
                state = ERROR_STATE;
                return;
            }
            _geolocation.addEventListener(GeolocationEvent.UPDATE,
                                          onGeolocationUpdate);
            _geolocation.setRequestedUpdateInterval(500);

            _geoTimer = new Timer(10000, 1);
            _geoTimer.addEventListener(TimerEvent.TIMER_COMPLETE,
                                       onTimeout);
            _geoTimer.start();
        }

        private function onGeolocationUpdate(event:GeolocationEvent):void
        {
            _geolocation.removeEventListener(GeolocationEvent.UPDATE,
                onGeolocationUpdate);
            _geolocation = null;

            var id:String = _formatter.format(event.latitude)
                        + ", "
                        + _formatter.format(event.longitude);
            executeSearch(new Location(id));
        }

        private function onTimeout(event:TimerEvent):void
        {
            _geoTimer.removeEventListener(TimerEvent.TIMER_COMPLETE,
                                          onTimeout);
            _geoTimer.stop();

            _geolocation.removeEventListener(GeolocationEvent.UPDATE,
                                             onGeolocationUpdate);
            _geolocation = null;

            error = "Establishing location timed out, please try again.";
            state = ERROR_STATE;
        }
    }
}