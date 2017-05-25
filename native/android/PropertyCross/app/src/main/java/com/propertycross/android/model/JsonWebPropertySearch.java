
package com.propertycross.android.model;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.propertycross.android.events.Callback;
import com.propertycross.android.presenter.IMarshalInvokeService;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class JsonWebPropertySearch implements IJsonPropertySearch {

    private final Map<String, Object> commonParams;
    private final IMarshalInvokeService marshal;
    private final String baseUrl = "https://api.nestoria.co.uk/api?";
    private final String TAG = "PropertyCross";
    private Context context;

    public JsonWebPropertySearch(Context context, IMarshalInvokeService service) {
        this.context = context;
        this.marshal = service;
        commonParams = new HashMap<String, Object>();
        commonParams.put("country", "uk");
        commonParams.put("pretty", 1);
        commonParams.put("action", "search_listings");
        commonParams.put("encoding", "json");
        commonParams.put("listing_type", "buy");
    }

    @Override
    public void findProperties(String location, int pageNumber,
            Callback<String> complete, Callback<Exception> error) {

        Map<String, Object> params = new HashMap<String, Object>(commonParams);
        params.put("place_name", location);
        params.put("page", pageNumber);

        String url = baseUrl + toQueryString(params);
        executeWebRequest(url, complete, error);
    }

    @Override
    public void findProperties(double latitude, double longitude, int pageNumber,
            Callback<String> complete, Callback<Exception> error) {

        Map<String, Object> params = new HashMap<String, Object>(commonParams);
        params.put("centre_point", Double.toString(latitude) + "," + Double.toString(longitude));
        params.put("page", pageNumber);

        String url = baseUrl + toQueryString(params);
        executeWebRequest(url, complete, error);

    }

    private String toQueryString(Map<String, Object> urlParams) {
        StringBuilder sb = new StringBuilder();

        Set<Entry<String, Object>> entrySet = urlParams.entrySet();
        Iterator<Entry<String, Object>> i = entrySet.iterator();
        Entry<String, Object> entry = null;

        while (i.hasNext()) {
            entry = i.next();
            sb.append(String.format("%s=%s", entry.getKey(), getValueOf(entry)));

            if (i.hasNext()) {
                sb.append("&");
            }
        }

        return sb.toString();
    }

    private String getValueOf(Entry<String, Object> entry) {
        Object value = entry.getValue();
        if (value == null) {
            return "";
        } else {
            return value.toString().replaceAll(" ", "%20");
        }

    }

    private void executeWebRequest(final String url,
                                   final Callback<String> complete,
            final Callback<Exception> error) {
                    Log.d(TAG, url);

        JsonObjectRequest jsObjRequest = new JsonObjectRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(final JSONObject response) {
                        marshal.invoke(new Callback<Void>() {

                            @Override
                            public void complete(Void paramT) {
                                complete.complete(response.toString());
                            }
                        });
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError e) {
                        marshal.invoke(new Callback<Void>() {

                            @Override
                            public void complete(Void paramT) {
                                error.complete(new Exception());
                            }
                        });
                    }
                });

        RequestQueue queue = Volley.newRequestQueue(context);
        queue.add(jsObjRequest);
    }
}
