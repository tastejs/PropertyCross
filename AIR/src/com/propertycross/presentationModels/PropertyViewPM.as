package com.propertycross.presentationModels
{
    import com.propertycross.events.AddFavouriteEvent;
    import com.propertycross.models.Property;

    import flash.events.Event;

    [Event(name="addFavourite", type="com.propertycross.events.AddFavouriteEvent")]

    [ManagedEvents("addFavourite")]
    public class PropertyViewPM extends BasePM
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const PROPERTY_CHANGED:String = "propertyInstanceChanged";

        private static const SEPARATOR:String = ",";


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


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        public function addToFavourites():void
        {
            dispatchEvent(new AddFavouriteEvent(property));
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