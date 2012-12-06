package com.propertycross.presentationModels
{
    import com.propertycross.events.SearchEvent;
    import com.propertycross.models.Property;
    import com.propertycross.models.SearchResult;
    import com.propertycross.views.PropertyView;

    import flash.events.Event;

    import mx.collections.ArrayList;
    import mx.collections.IList;

    [Event(name="search", type="com.propertycross.events.SearchEvent")]

    [ManagedEvents("search")]
    public class SearchResultsViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const PROPERTIES_CHANGED:String = "propertiesChanged";


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
            dispatchEvent(new SearchEvent(_currentLocation, _lastResult.page + 1));
        }
    }
}