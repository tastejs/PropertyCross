package com.propertycross.models
{
    public class SearchResult
    {
        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function SearchResult(properties:Array,
                                     locations:Array,
                                     totalResults:int,
                                     page:uint)
        {
            _properties = properties;
            _locations = locations;
            _totalResults = totalResults;
            _page = page;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  properties
        //----------------------------------

        private var _properties:Array;
        public function get properties():Array
        {
            return _properties;
        }

        //----------------------------------
        //  locations
        //----------------------------------

        private var _locations:Array;
        public function get locations():Array
        {
            return _locations;
        }

        //----------------------------------
        //  ambiguousLocation
        //----------------------------------

        public function get ambiguousLocation():Boolean
        {
            return _locations && _locations.length > 1;
        }

        //----------------------------------
        //  totalResults
        //----------------------------------

        private var _totalResults:int;
        public function get totalResults():int
        {
            return _totalResults;
        }

        //----------------------------------
        //  page
        //----------------------------------

        private var _page:uint;
        public function get page():uint
        {
            return _page;
        }

        //----------------------------------
        //  pageSize
        //----------------------------------

        public function get pageSize():uint
        {
            return 20;
        }
    }
}