package com.propertycross.mgwt.nestoria.gwt;

import static com.propertycross.mgwt.nestoria.Response.Code.*;
import java.util.ArrayList;
import java.util.List;
import com.google.gwt.core.shared.GWT;
import com.google.gwt.json.client.*;
import com.propertycross.mgwt.MgwtTestCase;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.nestoria.Response.Code;
import com.propertycross.mgwt.properties.Property;

public class ResponseHandlerGwtTest extends MgwtTestCase {

    private ResponseParser parser = new ResponseHandler();
    private Callback callback;
    private JSONObject json;
    private JSONObject response;
    private JSONArray locations;
    private List<Location> suggested = new ArrayList<Location>();
    private JSONArray results;
    private List<Property> properties = new ArrayList<Property>();
    private Mocks mocks;

    @Override
    protected void gwtSetUp() throws Exception
    {
        mocks = GWT.create(Mocks.class);

        callback = mocks.callback();

        json = new JSONObject();
        response = new JSONObject();
        json.put("response", response);

        response.put("page", new JSONNumber(3));
        response.put("total_results", new JSONString("375"));

        suggested.add(new Location("longA", "A"));
        suggested.add(new Location("longB", "B"));

        locations = JSONParser.parseStrict("[" +
    		"{\"long_title\": \"longA\", \"place_name\": \"A\"}," +
    		"{\"long_title\": \"longB\", \"place_name\": \"B\"}" +
		"]").isArray();

        properties.add(new Property("0", "t0", "p0", "bd0",
                "bt0", "tp0", "i0", "s0"));
        properties.add(new Property("1", "t1", "p1", "bd1",
                "bt1", "tp1", "i1", "s1"));

        results = JSONParser.parseStrict("[" +
            "{" +
            "\"guid\": \"0\", \"title\": \"t0\", " +
            "\"price_formatted\": \"p0\", \"bedroom_number\": \"bd0\", " +
            "\"bathroom_number\": \"bt0\", \"property_type\": \"tp0\", " +
            "\"img_url\": \"i0\", \"summary\": \"s0\"" +
            "}," +
            "{" +
            "\"guid\": \"1\", \"title\": \"t1\", " +
            "\"price_formatted\": \"p1\", \"bedroom_number\": \"bd1\", " +
            "\"bathroom_number\": \"bt1\", \"property_type\": \"tp1\", " +
            "\"img_url\": \"i1\", \"summary\": \"s1\"" +
            "}" +
        "]").isArray();
    }

    public void testUnknownCode() throws Throwable
    {
        response.put("application_response_code", new JSONString("999"));

        try {
            parser.parse(json, callback);
            fail("didn't throw");
        }
        catch(IllegalArgumentException ex) {
            assertTrue(ex.getMessage().contains("999"));
        }
    }

    public void testCoordinateErrorWithLocationsSuggested() throws Throwable
    {
        setResponseCode(COORDINATE_ERROR);

        locationsTest();
    }

    public void testCoordinateErrorNoLocations() throws Throwable
    {
        setResponseCode(COORDINATE_ERROR);

        noLocationsTest();
    }

    public void testMisspelledWithLocationsSuggested() throws Throwable
    {
        setResponseCode(MISSPELLED);

        locationsTest();
    }

    public void testMisspelledNoLocations() throws Throwable
    {
        setResponseCode(MISSPELLED);

        noLocationsTest();
    }

    public void testUnknownWithLocationsSuggested() throws Throwable
    {
        setResponseCode(UNKNOWN);

        locationsTest();
    }

    public void testUnknownNoLocations() throws Throwable
    {
        setResponseCode(UNKNOWN);

        noLocationsTest();
    }

    public void testAmbiguousWithLocationsSuggested() throws Throwable
    {
        setResponseCode(AMBIGUOUS);

        locationsTest();
    }

    public void testAmbiguousNoLocations() throws Throwable
    {
        setResponseCode(AMBIGUOUS);

        noLocationsTest();
    }

    private void setResponseCode(Code c)
    {
        response.put("application_response_code",
                new JSONString(Integer.toString(c.intVal)));
    }

    private void locationsTest() throws Throwable
    {
        response.put("locations", locations);

        callback.onNoLocation(suggested);
        mocks.expectLastCall();

        mocks.replay();

        parser.parse(json, callback);
    }

    private void noLocationsTest() throws Throwable
    {
        callback.onNoLocation();
        mocks.expectLastCall();

        mocks.replay();

        parser.parse(json, callback);
    }

    public void testLarge() throws Throwable
    {
        setResponseCode(LARGE);

        resultsFoundTest();
    }

    public void testUnambiguous() throws Throwable
    {
        setResponseCode(UNAMIBIGUOUS);

        resultsFoundTest();
    }

    public void testBestGuess() throws Throwable
    {
        setResponseCode(BEST_GUESS);

        resultsFoundTest();
    }

    private void resultsFoundTest() throws Throwable
    {
        response.put("locations", locations);
        response.put("listings", results);

        callback.onResultsFound(properties, suggested.get(0), 3, 375);
        mocks.expectLastCall();

        mocks.replay();

        parser.parse(json, callback);
    }

}
