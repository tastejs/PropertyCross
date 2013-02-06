package com.propertycross.properties;

import java.util.ArrayList;
import java.util.List;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.googlecode.mgwt.storage.client.Storage;


final class MgwtStorage implements PropertiesStorage {

    private static final String KEY = "favourites";

    private final Storage storage;

    public MgwtStorage(Storage storage)
    {
        this.storage = storage;
    }

    @Override
    public void saveFavourites(List<Property> favourites)
    {
        JSONArray arr = new JSONArray();
        for(int i = 0, j = favourites.size(); i < j; ++i) {
            Property p = favourites.get(i);
            JSONObject o = new JSONObject();
            o.put("id", new JSONString(p.id()));
            o.put("title", new JSONString(p.title()));
            o.put("price", new JSONString(p.price()));
            o.put("bedrooms", new JSONString(p.bedrooms()));
            o.put("bathrooms", new JSONString(p.bathrooms()));
            o.put("type", new JSONString(p.type()));
            o.put("imgUrl", new JSONString(p.imgUrl().asString()));
            o.put("summary", new JSONString(p.summary()));
            arr.set(i, o);
        }
        storage.setItem(KEY, arr.toString());
    }

    @Override
    public void clearFavourites()
    {
        storage.removeItem(KEY);
    }

    @Override
    public List<Property> favourites()
    {
        String json = storage.getItem(KEY);

        List<Property> q = new ArrayList<Property>();

        if(json == null) return q;

        JSONArray arr = JSONParser.parseStrict(json).isArray();
        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            q.add(new Property(
                o.get("id").isString().stringValue(),
                o.get("title").isString().stringValue(),
                o.get("price").isString().stringValue(),
                o.get("bedrooms").isString().stringValue(),
                o.get("bathrooms").isString().stringValue(),
                o.get("type").isString().stringValue(),
                o.get("imgUrl").isString().stringValue(),
                o.get("summary").isString().stringValue()
            ));
        }
        return q;
    }

}
