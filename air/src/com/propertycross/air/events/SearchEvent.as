package com.propertycross.air.events
{
    import flash.events.Event;

    public class SearchEvent extends Event
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        public static const SEARCH:String = "search";
        public static const SEARCH_BY_COORDINATES:String = "searchByCoordinates";


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function SearchEvent(type:String, location:String, page:uint = 1)
        {
            super(type);
            _location = location;
            _page = page;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  location
        //----------------------------------

        private var _location:String;
        public function get location():String
        {
            return _location;
        }

        //----------------------------------
        //  page
        //----------------------------------

        private var _page:uint;
        public function get page():uint
        {
            return _page;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        override public function clone():Event
        {
            return new SearchEvent(type, location, page);
        }
    }
}