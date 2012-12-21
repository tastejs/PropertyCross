package com.propertycross.android.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.util.Log;

import com.propertycross.android.events.Callback;
import com.propertycross.android.presenter.IMarshalInvokeService;

public class JsonWebPropertySearch implements IJsonPropertySearch {

	private Map<String, Object> commonParams;
	private IMarshalInvokeService marshal;
	private final String baseUrl = "http://api.nestoria.co.uk/api?";
	private final String TAG = "PropertyCross"; 
	
	public JsonWebPropertySearch(IMarshalInvokeService service) {
		this.marshal = service;
		commonParams = new HashMap<String, Object>();
		commonParams.put("country", "uk");
		commonParams.put("pretty", 1);
		commonParams.put("action", "search_listings");
		commonParams.put("encoding", "json");
		commonParams.put("listing_type", "buy");
	}	
	
	public void findProperties(String location, int pageNumber,
			Callback<String> complete, Callback<Exception> error) {
		
		Map<String, Object> params = new HashMap<String, Object>(commonParams);
		params.put("place_name", location);
		params.put("page", pageNumber);
		
		String url = baseUrl + toQueryString(params);
		executeWebRequest(url, complete, error);		
	}

	public void findProperties(double latitude, double longitude, int pageNumber,
			Callback<String> complete, Callback<Exception> error) {
		
		Map<String, Object> params = new HashMap<String, Object>(commonParams);
		params.put("centre_point", Double.toString(latitude)+ "," + Double.toString(longitude));
		params.put("page", pageNumber);
		
		String url = baseUrl + toQueryString(params);
		executeWebRequest(url, complete, error);
		
	}
	
	private String toQueryString(Map<String, Object> urlParams) {
		StringBuilder sb = new StringBuilder();
		
		Set<Entry<String, Object>> entrySet = urlParams.entrySet();
		Iterator<Entry<String, Object>> i = entrySet.iterator();
		Entry<String, Object> entry = null;
		
		while(i.hasNext()) {
			entry = i.next();
			sb.append(String.format("%s=%s", entry.getKey(), entry.getValue().toString()));
			
			if(i.hasNext()) {
				sb.append("&");
			}			
		}
		
		return sb.toString();
	}
	
	private void executeWebRequest(final String url, final Callback<String> complete, final Callback<Exception> error) {
		new Thread(new Runnable() {
	        public void run() {
		try {
			Log.d(TAG, url);
			DefaultHttpClient client = new DefaultHttpClient();
			HttpGet request = new HttpGet(url);
			HttpResponse response = client.execute(request);
			
			BufferedReader reader = 
					new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
			
			final StringBuilder builder = new StringBuilder();
			for(String line = null; (line = reader.readLine()) != null;) {
				builder.append(line);
			}
			
			marshal.invoke(new Callback<Void>() {

				@Override
				public void complete(Void paramT) {
					complete.complete(builder.toString());
				}				
			});
			
		} catch (final Exception e) {
			Log.d(TAG, e.getMessage());
			marshal.invoke(new Callback<Void>() {

				@Override
				public void complete(Void paramT) {
					error.complete(e);
				}				
			});
		}
	        }
		}).start();
	}
}