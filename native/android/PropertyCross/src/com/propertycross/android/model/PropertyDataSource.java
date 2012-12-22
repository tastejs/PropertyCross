package com.propertycross.android.model;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import com.propertycross.android.events.Callback;

public class PropertyDataSource {

	private IJsonPropertySearch jsonPropertySearch;

	public PropertyDataSource(IJsonPropertySearch jsonPropertySearch) {
		this.jsonPropertySearch = jsonPropertySearch;
	}

	public void findProperties(String searchText, int pageNumber,
			Callback<PropertyDataSourceResult> complete, Callback<Exception> error) {
		final Callback<PropertyDataSourceResult> callback = complete;

		jsonPropertySearch.findProperties(searchText, pageNumber,
				new Callback<String>() {
					public void complete(String result) {
						handleResponse(result, callback);
					}
				}, error);
	}

	public void findProperties(double latitude, double longitude, int pageNumber,
			Callback<PropertyDataSourceResult> complete, Callback<Exception> error) {
		final Callback<PropertyDataSourceResult> callback = complete;

		jsonPropertySearch.findProperties(latitude, longitude, pageNumber,
				new Callback<String>() {
					public void complete(String result) {
						handleResponse(result, callback);
					}
				}, error);
	}

	private void handleResponse(String jsonResponse, Callback<PropertyDataSourceResult> complete) {
		try {
			JSONObject json = new JSONObject(jsonResponse);
			JSONObject response = json.getJSONObject("response");
			String responseCode = response.getString("application_response_code");
			
			if ((responseCode.equals("100")) || (responseCode.equals("101"))
					|| (responseCode.equals("110"))) {
				PropertyDataSourceResult result = new PropertyListingsResult(json);
				complete.complete(result);
			}
			else if ((responseCode.equals("200")) || (responseCode.equals("202"))) {
				PropertyDataSourceResult result = new PropertyLocationsResult(json);
				complete.complete(result);
			}
			else {
				fail(complete);
			}
		}
		catch (JSONException e) {
			fail(complete);
		}
		catch (IndexOutOfBoundsException e) {
			fail(complete);
		}
	}

	private void fail(Callback<PropertyDataSourceResult> complete) {
		PropertyDataSourceResult result = new PropertyUnknownLocationResult();
		complete.complete(result);
	}
}