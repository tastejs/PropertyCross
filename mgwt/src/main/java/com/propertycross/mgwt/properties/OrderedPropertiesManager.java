package com.propertycross.mgwt.properties;

import java.util.ArrayList;
import java.util.List;
import com.googlecode.mgwt.storage.client.Storage;

public final class OrderedPropertiesManager implements PropertiesManager {

    private final PropertiesStorage storage;
    private final List<Property> cache;

    OrderedPropertiesManager(PropertiesStorage storage)
    {
        this.storage = storage;
        cache = storage.favourites();
    }

    public OrderedPropertiesManager(Storage storage)
    {
        this(new MgwtStorage(storage));
    }

    @Override
    public boolean isFavourite(Property p)
    {
        return cache.contains(p);
    }

    @Override
    public List<Property> loadFavourites()
    {
        return new ArrayList<Property>(cache);
    }

    @Override
    public void removeFavourite(Property p)
    {
        if(!cache.contains(p)) return;
        cache.remove(p);
        storage.saveFavourites(cache);
    }

    @Override
    public void addFavourite(Property p)
    {
        cache.remove(p);
        cache.add(p);
        storage.saveFavourites(cache);
    }

}
