package com.propertycross.air.events
{
    import flash.events.Event;

    import spark.components.ViewNavigator;

    public class NavigatorCreatedEvent extends Event
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        public static const NAVIGATOR_CREATED : String = "navigatorCreated";


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function NavigatorCreatedEvent(navigator:ViewNavigator)
        {
            super(NAVIGATOR_CREATED);
            _navigator = navigator;
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  navigator
        //----------------------------------

        private var _navigator:ViewNavigator;
        public function get navigator():ViewNavigator
        {
            return _navigator;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        override public function clone():Event
        {
            return new NavigatorCreatedEvent(navigator);
        }
    }
}