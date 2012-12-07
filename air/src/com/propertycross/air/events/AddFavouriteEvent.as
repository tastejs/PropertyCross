package com.propertycross.air.events
{
    import flash.events.Event;

    import com.propertycross.air.models.Property;

    public class AddFavouriteEvent extends Event
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        public static const ADD_FAVOURITE:String = "addFavourite";


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function AddFavouriteEvent(property:Property)
        {
            super(ADD_FAVOURITE);
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
            return new AddFavouriteEvent(property);
        }
    }
}