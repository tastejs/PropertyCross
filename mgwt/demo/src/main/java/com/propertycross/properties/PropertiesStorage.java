package com.propertycross.properties;

import java.util.List;


interface PropertiesStorage {
    
    void saveFavourites(List<Property> rs);
    List<Property> favourites();
    void clearFavourites();

}
