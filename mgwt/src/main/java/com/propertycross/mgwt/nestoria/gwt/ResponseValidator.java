package com.propertycross.mgwt.nestoria.gwt;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.propertycross.mgwt.nestoria.Response;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;


final class ResponseValidator implements ResponseParser {

    private final ResponseParser wrapped;

    public ResponseValidator(ResponseParser wrapped)
    {
        this.wrapped = wrapped;
    }

    @Override
    public void parse(JSONObject root, Callback c) throws ParseException
    {
        validate(root);
        wrapped.parse(root, c);
    }

    private void validate(JSONObject root) throws ParseException
    {
        if(!root.containsKey("response") ||
                root.get("response").isObject() == null) {
            throw new ParseException("missing response field");
        }

        JSONObject json = root.get("response").isObject();

        switch(validateCode(json)) {
            case UNAMIBIGUOUS:
            case BEST_GUESS:
            case LARGE:
                validateLocations(json, 1);
                validateResults(json);
                break;
            default:
                validateLocations(json, 0);
        }
    }

    private void validateLocations(JSONObject json, int minimumExpected)
            throws ParseException
    {
        if(minimumExpected == 0 && !json.containsKey("locations")) return;

        JSONArray arr = json.get("locations").isArray();
        if(arr == null) {
            throw new ParseException("locations is not an array");
        }
        if(arr.size() < minimumExpected) {
            throw new ParseException("too few locations");
        }

        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            if(o == null) {
                throw new ParseException("location not object: " + arr.get(i));
            }
            validateString(o, "long_title");
            validateString(o, "place_name");
        }
    }

    private void validateResults(JSONObject json) throws ParseException
    {
        if(!json.containsKey("listings")) {
            throw new ParseException("listings not in response");
        }
        JSONArray arr = json.get("listings").isArray();
        if(arr == null) {
            throw new ParseException("listings is not an array");
        }

        for(int i = 0, j = arr.size(); i < j; ++i) {
            JSONObject o = arr.get(i).isObject();
            if(o == null) {
                throw new ParseException("listing not object: " + arr.get(i));
            }
            validateString(o, "guid");
            validateString(o, "title");
            validateString(o, "price_formatted");
            validateString(o, "bedroom_number");
            validateString(o, "bathroom_number");
            validateString(o, "property_type");
            validateString(o, "img_url");
            validateString(o, "summary");
        }
    }

    private String validateString(JSONObject j, String key)
            throws ParseException
    {
        if(!j.containsKey(key)) {
            throw new ParseException(key + " not in response");
        }

        JSONString js = j.get(key).isString();
        if(js == null) {
            throw new ParseException(key + " is not a string");
        }

        return js.stringValue().trim();
    }

    private Response.Code validateCode(JSONObject json) throws ParseException
    {
        String code = validateString(json, "application_response_code");
        try {
            return Response.Code.valueOf(Integer.parseInt(code));
        }
        catch(IllegalArgumentException ex) {
            throw new ParseException("unknown response code: " + code);
        }
    }

}
