package com.propertycross.presentationModels
{
    import com.propertycross.controllers.FavouritesController;

    import com.propertycross.models.Property;

    import mx.collections.IList;

    import com.propertycross.views.PropertyView;

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