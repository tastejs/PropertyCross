package com.propertycross.presentationModels
{
    import com.propertycross.events.SearchEvent;
    import com.propertycross.models.Property;
    import com.propertycross.models.SearchResult;
    import com.propertycross.views.PropertyView;

    import flash.events.Event;

    import mx.collections.ArrayList;
    import mx.collections.IList;

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
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  properties
        //----------------------------------

        private var _properties:IList;
        [Bindable("propertiesChanged")]
        public function get properties():IList
        {
            return _properties;
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
            _properties = new ArrayList(result.properties);
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
    }
}