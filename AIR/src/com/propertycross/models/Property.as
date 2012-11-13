package com.propertycross.models
{
    public class Property
    {
        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function Property(guid:String,
                                 price:Number,
                                 bedrooms:int,
                                 bathrooms:int,
                                 type:String,
                                 title:String,
                                 summary:String,
                                 thumbnailURL:String,
                                 imageURL:String)
        {
            _guid = guid;
            _price = price;
            _bedrooms = bedrooms;
            _bathrooms = bathrooms;
            _type = type;
            _title = title;
            _summary = summary;
            _thumbnailURL = thumbnailURL;
            _imageURL = imageURL;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  guid
        //----------------------------------

        private var _guid:String;
        public function get guid():String
        {
            return _guid;
        }

        //----------------------------------
        //  price
        //----------------------------------

        private var _price:Number;
        public function get price():Number
        {
            return _price;
        }

        //----------------------------------
        //  bedrooms
        //----------------------------------

        private var _bedrooms:int;
        public function get bedrooms():int
        {
            return _bedrooms;
        }

        //----------------------------------
        //  bathrooms
        //----------------------------------

        private var _bathrooms:int;
        public function get bathrooms():int
        {
            return _bathrooms;
        }

        //----------------------------------
        //  type
        //----------------------------------

        private var _type:String;
        public function get type():String
        {
            return _type;
        }

        //----------------------------------
        //  title
        //----------------------------------

        private var _title:String;
        public function get title():String
        {
            return _title;
        }

        //----------------------------------
        //  summary
        //----------------------------------

        private var _summary:String;
        public function get summary():String
        {
            return _summary;
        }

        //----------------------------------
        //  thumbnailURL
        //----------------------------------

        private var _thumbnailURL:String;
        public function get thumbnailURL():String
        {
            return _thumbnailURL;
        }

        //----------------------------------
        //  imgURL
        //----------------------------------

        private var _imageURL:String;
        public function get imageURL():String
        {
            return _imageURL;
        }
    }
}