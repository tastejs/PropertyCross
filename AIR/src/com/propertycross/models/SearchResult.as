package com.propertycross.models
{
    public class SearchResult
    {
        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function SearchResult(properties:Array, totalResults:int)
        {
            _properties = properties;
            _totalResults = totalResults;
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
        //  totalResults
        //----------------------------------

        private var _totalResults:int;
        public function get totalResults():int
        {
            return _totalResults;
        }
    }
}