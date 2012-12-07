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


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function SearchEvent(location:String, page:uint = 1)
        {
            super(SEARCH);
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
            return new SearchEvent(location, page);
        }
    }
}