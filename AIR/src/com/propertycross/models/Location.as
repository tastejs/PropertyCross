package com.propertycross.models
{
    public class Location
    {
        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function Location(id:String,
                                 name:String = null,
                                 totalResults:int = 0)
        {
            _id = id;
            _name = name;
            this.totalResults = totalResults;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  id
        //----------------------------------

        private var _id:String;
        public function get id():String
        {
            return _id;
        }

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

        public var totalResults:int;
    }
}