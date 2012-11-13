package com.propertycross.air.events
{
    import com.propertycross.air.models.Property;

    import flash.events.Event;

    public class FavouriteEvent extends Event
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        public static const ADD_FAVOURITE:String = "addFavourite";
        public static const REMOVE_FAVOURITE:String = "removeFavourite";


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function FavouriteEvent(type:String, property:Property)
        {
            super(type);
            _property = property;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  property
        //----------------------------------

        private var _property:Property;
        public function get property():Property
        {
            return _property;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        override public function clone():Event
        {
            return new FavouriteEvent(type, property);
        }
    }
}