package com.propertycross.models
{
    public class Location
    {
        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function Location(name:String, totalResults:int = 0)
        {
            _name = name;
            _totalResults = totalResults;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  name
        //----------------------------------

        private var _name:String;
        public function get name():String
        {
            return _name;
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