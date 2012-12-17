package com.propertycross.air.controllers
{
    import com.propertycross.air.models.Property;

    import flash.events.EventDispatcher;

    import mx.collections.ArrayCollection;
    import mx.collections.IList;

    import spark.managers.PersistenceManager;

    public class FavouritesController extends EventDispatcher
    {
        //------------------------------------
        //
        ///  Constants
        //
        //------------------------------------

        private static const FAVOURITES:String = "favourites";


        //------------------------------------
        //
        ///  Class Variables
        //
        //------------------------------------

        private var _persistenceManager:PersistenceManager;


        //------------------------------------
        //
        ///  Constructor
        //
        //------------------------------------

        public function FavouritesController()
        {
            _persistenceManager = new PersistenceManager();
            _persistenceManager.load();
            _favourites = getFavouritesFromLocalStorage();
        }


        //------------------------------------
        //
        ///  Properties
        //
        //------------------------------------

        //----------------------------------
        //  favourites
        //----------------------------------

        private var _favourites:IList;
        public function get favourites():IList
        {
            return _favourites;
        }


        //------------------------------------
        //
        ///  Methods
        //
        //------------------------------------

        [MessageHandler(type="com.propertycross.air.events.FavouriteEvent",
                        selector="addFavourite",
                        messageProperties="property")]
        public function onAddFavourite(property:Property):void
        {
            for each (var favourite : Property in _favourites)
            {
                if (favourite.guid == property.guid)
                {
                    return;
                }
            }
            _favourites.addItem(property);
            updatePersistedFavourites();
        }

        [MessageHandler(type="com.propertycross.air.events.FavouriteEvent",
                        selector="removeFavourite",
                        messageProperties="property")]
        public function onRemoveFavourite(property:Property):void
        {
            for each (var favourite : Property in _favourites)
            {
                if (favourite.guid == property.guid)
                {
                    _favourites.removeItemAt(_favourites.getItemIndex(favourite));
                    updatePersistedFavourites();
                    break;
                }
            }
        }

        public function isFavourite(property:Property):Boolean
        {
            return _favourites.getItemIndex(property) != -1;
        }

        private function updatePersistedFavourites():void
        {
            _persistenceManager.setProperty(FAVOURITES,
                                            JSON.stringify(_favourites.toArray()));
        }

        private function getFavouritesFromLocalStorage():IList
        {
            var json : String =
                _persistenceManager.getProperty(FAVOURITES) as String;
            if ( !json )
            {
                return new ArrayCollection();
            }
            var favourites : Array = JSON.parse(json) as Array;
            return new ArrayCollection(favourites.map(asProperty));
        }

        private static function asProperty(item:Object,
                                           index:int,
                                           array:Array):Property
        {
            return new Property(item.guid,
                                item.price,
                                item.bedrooms,
                                item.bathrooms,
                                item.type,
                                item.title,
                                item.summary,
                                item.thumbnailURL,
                                item.imageURL);
        }
    }
}