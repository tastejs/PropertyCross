package com.propertycross.locations;

import java.util.LinkedList;
import java.util.Queue;
import com.google.gwt.json.client.*;
import com.googlecode.mgwt.storage.client.Storage;


final class MgwtStorage implements SearchesStorage {
    
    private static final String KEY = "recentSearches";
    
    private final Storage storage;

    public MgwtStorage(Storage storage)
    {
        this.storage = storage;
    }
    
    @Override
    public void clear()
    {
        storage.removeItem(KEY);
    }
    
    @Override
    public void save(Queue<Search> q)
    {
        JSONArray arr = new JSONArray();
        int i = 0;
        for(Search e : q) {
            JSONObject o = new JSONObject();
            o.put("location", new JSONString(e.location()));
            o.put("hits", new JSONNumber(e.numberProperties()));
            arr.set(i++, o);
        }
        storage.setItem(KEY, arr.toString());
    }

    @Override
    public Queue<Search> load()
    {
        String json = storage.getItem(KEY);
        
        Queue<Search> q = new LinkedList<Search>();
        
        if(json == null) return q;
        
        JSONArray arr = JSONParser.parseStrict(json).isArray();
        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            String loc = o.get("location").isString().stringValue();
            int num = (int)o.get("hits").isNumber().doubleValue();
            q.add(new Search(loc, num));
        }
        return q;
    }

}
