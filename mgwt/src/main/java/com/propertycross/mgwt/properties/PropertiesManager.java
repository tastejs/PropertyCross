package com.propertycross.mgwt.properties;

import java.util.List;

public interface PropertiesManager {

    List<Property> loadFavourites();
    void addFavourite(Property p);
    void removeFavourite(Property p);
    boolean isFavourite(Property p);

}
