package com.propertycross.presentationModels
{
    import com.propertycross.events.AddFavouriteEvent;

    import flash.events.Event;

    import com.propertycross.models.Property;

    [Event(name="addFavourite", type="com.propertycross.events.AddFavouriteEvent")]

    [ManagedEvents("addFavourite")]
    public class PropertyViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const PROPERTY_CHANGED : String = "propertyInstanceChanged";


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
        public function set property(value:Property):void
        {
            if (value == _property)
            {
                return;
            }
            _property = value;
            dispatchEvent(new Event(PROPERTY_CHANGED));
        }

        //----------------------------------
        //  title
        //----------------------------------

        [Bindable("propertyInstanceChanged")]
        public function get title():String
        {
            return _property ? _property.title : null;
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


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function addToFavourites():void
        {
            dispatchEvent(new AddFavouriteEvent(property));
        }
    }
}