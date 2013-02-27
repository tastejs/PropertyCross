package com.propertycross.mgwt.nestoria.gwt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONValue;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.Response;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.properties.Property;

final class ResponseHandler implements ResponseParser {

    @Override
    public void parse(JSONObject root, Callback c) throws ParseException
    {
        parseResponse(root.get("response").isObject()).process(c);
    }

    private Response parseResponse(JSONObject json) throws ParseException
    {
        List<Location> locs = parseLocations(json);
        switch(parseCode(json)) {
            case UNAMIBIGUOUS:
            case BEST_GUESS:
            case LARGE:
                List<Property> results = parseResults(json);
                return new Response.ListingsFound(
                    results,
                    locs.get(0),
                    toInt(json, "page", 1),
                    toInt(json, "total_results", results.size()),
                    toInt(json, "total_pages", 0)                    
                );
            default:
                return new Response.NoLocation(locs);
        }
    }

    private List<Location> parseLocations(JSONObject json) throws ParseException
    {
        if(!json.containsKey("locations")) {
            return Collections.emptyList();
        }
        JSONArray arr = json.get("locations").isArray();
        List<Location> list = new ArrayList<Location>(arr.size());
        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            list.add(new Location(o.get("long_title").isString().stringValue(),
                o.get("place_name").isString().stringValue())
            );
        }
        return list;
    }

    private int toInt(JSONObject json, String key, int deflt)
    {
        if(!json.containsKey(key)) return deflt;
        JSONValue val = json.get(key);

        if(val.isNumber() != null) {
            return (int)val.isNumber().doubleValue();
        }

        return Integer.parseInt(val.isString().stringValue());
    }

    private List<Property> parseResults(JSONObject json) throws ParseException
    {
        JSONArray arr = json.get("listings").isArray();
        List<Property> list = new ArrayList<Property>(arr.size());
        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            list.add(new Property(o.get("guid").isString().stringValue(),
                o.get("title").isString().stringValue(),
                o.get("price_formatted").isString().stringValue(),
                o.get("bedroom_number").isString().stringValue(),
                o.get("bathroom_number").isString().stringValue(),
                o.get("property_type").isString().stringValue(),
                o.get("img_url").isString().stringValue(),
                o.get("summary").isString().stringValue())
            );
        }
        return list;
    }

    private Response.Code parseCode(JSONObject json) throws ParseException
    {
        String code = json.get("application_response_code")
                .isString().stringValue().trim();
        return Response.Code.valueOf(Integer.parseInt(code));
    }

}
