package com.propertycross.events
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

        public function SearchEvent(location:String)
        {
            super(SEARCH);
            _location = location;
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


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        override public function clone():Event
        {
            return new SearchEvent(location);
        }
    }
}