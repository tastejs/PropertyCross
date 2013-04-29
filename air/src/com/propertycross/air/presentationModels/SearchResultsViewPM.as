package com.propertycross.air.presentationModels
{
    import com.propertycross.air.events.SearchEvent;
    import com.propertycross.air.models.Property;
    import com.propertycross.air.models.SearchResult;
    import com.propertycross.air.views.PropertyView;

    import flash.events.Event;

    import mx.collections.ArrayList;
    import mx.collections.IList;

    [Event(name="search", type="com.propertycross.air.events.SearchEvent")]

    [ManagedEvents("search")]
    public class SearchResultsViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const PROPERTIES_CHANGED:String = "propertiesChanged";
        private static const LOADING_CHANGED:String = "loadingChanged";

        private static const LOAD_MORE:String = "Load more...";
        private static const LOADING:String = "Loading...";


        //------------------------------------
        //
        ///  Class Variables
        //
        //------------------------------------

        private var _currentLocation:String;
        private var _lastResult:SearchResult;


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  properties
        //----------------------------------

        private var _properties:ArrayList;
        [Bindable("propertiesChanged")]
        public function get properties():IList
        {
            return _properties;
        }

        //----------------------------------
        //  title
        //----------------------------------

        [Bindable("propertiesChanged")]
        public function get title():String
        {
            if (!_lastResult)
            {
                return "No results";
            }
            return _lastResult.page * _lastResult.pageSize + " of " + _lastResult.totalResults;
        }

        //----------------------------------
        //  loadPrompt
        //----------------------------------

        [Bindable("loadingChanged")]
        public function get loadPrompt():String
        {
            return loading ? LOADING : LOAD_MORE;
        }

        //----------------------------------
        //  loadPromptDetails
        //----------------------------------

        [Bindable("loadingChanged")]
        public function get loadPromptDetails():String
        {
            return loading ? "" : "Results for " + _currentLocation + ", showing " + title + " properties";
        }

        //----------------------------------
        //  loading
        //----------------------------------

        private var _loading:Boolean;
        protected function get loading():Boolean
        {
            return _loading;
        }
        protected function set loading(value:Boolean):void
        {
            if (value != _loading)
            {
                _loading = value;
                dispatchEvent(new Event(LOADING_CHANGED));
            }
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
            if (event.page == 0 || event.location != _currentLocation)
            {
                _properties = new ArrayList(result.properties);
                _currentLocation = event.location;
            }
            else if (event.page > _lastResult.page)
            {
                _properties.addAll(new ArrayList(result.properties));
            }
            else
            {
                return;
            }
            _lastResult = result;
            loading = false;
            dispatchEvent(new Event(PROPERTIES_CHANGED));
        }

        public function viewProperty(property:Property):void
        {
            if (!navigator)
            {
                return;
            }
            navigator.pushView(PropertyView, property);
        }

        public function loadMore():void
        {
            loading = true;
            dispatchEvent(new SearchEvent(SearchEvent.SEARCH, _currentLocation, _lastResult.page + 1));
        }
    }
}