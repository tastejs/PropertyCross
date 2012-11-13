package com.propertycross.presentationModels
{
    import flash.events.EventDispatcher;

    import spark.components.ViewNavigator;

    public class BasePM extends EventDispatcher
    {
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