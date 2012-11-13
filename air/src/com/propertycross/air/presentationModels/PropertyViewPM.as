package com.propertycross.air.presentationModels
{
    import com.propertycross.air.controllers.FavouritesController;
    import com.propertycross.air.events.FavouriteEvent;
    import com.propertycross.air.models.Property;

    import flash.events.Event;

    [Event(name="addFavourite", type="com.propertycross.air.events.FavouriteEvent")]
    [Event(name="removeFavourite", type="com.propertycross.air.events.FavouriteEvent")]

    [ManagedEvents("addFavourite,removeFavourite")]
    public class PropertyViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const PROPERTY_CHANGED:String = "propertyInstanceChanged";
        private static const IS_FAVOURITE_CHANGED:String = "isFavouriteChanged";

        private static const SEPARATOR:String = ",";


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
        //  property
        //----------------------------------

        private var _property:Property;
        public function get property():Property
        {
            return _property;
        }
        public function set property(value:Property):void
        {
            if (value == _property)
            {
                return;
            }
            _property = value;
            _title = createTitle(_property);
            dispatchEvent(new Event(PROPERTY_CHANGED));
        }

        //----------------------------------
        //  title
        //----------------------------------

        private var _title:String;
        [Bindable("propertyInstanceChanged")]
        public function get title():String
        {
            return _title;
        }

        //----------------------------------
        //  imageURL
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get imageURL():String
        {
            return _property ? _property.imageURL : null;
        }

        //----------------------------------
        //  price
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get price():Number
        {
            return _property ? _property.price : NaN;
        }

        //----------------------------------
        //  bedroomCount
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get bedroomCount():Number
        {
            return _property ? _property.bedrooms : NaN;
        }

        //----------------------------------
        //  bathroomCount
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get bathroomCount():Number
        {
            return _property ? _property.bathrooms : NaN;
        }

        //----------------------------------
        //  summary
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get summary():String
        {
            return _property ? _property.summary : null;
        }

        //----------------------------------
        //  favouriteLabel
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        [Bindable("isFavouriteChanged")]
        public function get favouriteLabel():String
        {
            return isFavourite ? "Un-fave" : "Fave";
        }

        //----------------------------------
        //  isFavourite
        //----------------------------------

        protected function get isFavourite():Boolean
        {
            return favouritesController.isFavourite(_property);
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function toggleFavouriteStatus():void
        {
            var type:String = isFavourite ? FavouriteEvent.REMOVE_FAVOURITE
                                          : FavouriteEvent.ADD_FAVOURITE;
            dispatchEvent(new FavouriteEvent(type, property));
            dispatchEvent(new Event(IS_FAVOURITE_CHANGED));
        }

        private function createTitle(property:Property):String
        {
            if (!property)
            {
                return "No property selected";
            }
            var parts:Array = property.title.split(SEPARATOR);
            return parts[0] + SEPARATOR + parts[1];
        }
    }
}