package com.propertycross.presentationModels
{
    import flash.events.EventDispatcher;
    import flash.system.Capabilities;

    import spark.components.ViewNavigator;

    public class BasePM extends EventDispatcher
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const ANDROID : String = "AND";


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  navigator
        //----------------------------------

        [MessageBinding(messageProperty="navigator",
                        type="com.propertycross.events.NavigatorCreatedEvent")]
        public var navigator:ViewNavigator;

        //----------------------------------
        //  osRequiresSoftBackButton
        //----------------------------------

        public function get osRequiresSoftBackButton():Boolean
        {
            return Capabilities.version.indexOf(ANDROID) != 0;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function back():void
        {
            if (!navigator)
            {
                return;
            }
            navigator.popView();
        }
    }
}