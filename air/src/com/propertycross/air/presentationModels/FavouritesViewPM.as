package com.propertycross.air.presentationModels
{
    import com.propertycross.air.controllers.FavouritesController;

    import com.propertycross.air.models.Property;

    import mx.collections.IList;

    import com.propertycross.air.views.PropertyView;

    public class FavouritesViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  favouritesController
        //----------------------------------

        [Inject]
        public var favouritesController:FavouritesController;

        //----------------------------------
        //  favourites
        //----------------------------------

        public function get favourites():IList
        {
            return favouritesController ? favouritesController.favourites : null;
        }

        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function viewProperty(property:Property):void
        {
            if (!navigator)
            {
                return;
            }
            navigator.pushView(PropertyView, property);
        }
    }
}