package com.propertycross.android.model;

import org.json.JSONException;
import org.json.JSONObject;

import com.propertycross.android.events.Callback;

public class PropertyDataSource {

    private final static String TAG = "PROPERTYDATASOURCE";
	private IJsonPropertySearch jsonPropertySearch;

	public PropertyDataSource(IJsonPropertySearch jsonPropertySearch) {
		this.jsonPropertySearch = jsonPropertySearch;
	}

	public void findProperties(String searchText, int pageNumber,
			final Callback<PropertyDataSourceResult> complete, final Callback<Exception> error) {

		jsonPropertySearch.findProperties(searchText, pageNumber,
				new Callback<String>() {
					public void complete(String result) {
						handleResponse(result, complete, error);
					}
				}, error);
	}

	public void findProperties(double latitude, double longitude, int pageNumber,
			final Callback<PropertyDataSourceResult> complete, final Callback<Exception> error) {

		jsonPropertySearch.findProperties(latitude, longitude, pageNumber,
				new Callback<String>() {
					public void complete(String result) {
						handleResponse(result, complete, error);
					}
				}, error);
	}

	private void handleResponse(String jsonResponse,
	        Callback<PropertyDataSourceResult> complete, Callback<Exception> error) {
		try {
			JSONObject json = new JSONObject(jsonResponse);
			JSONObject response = json.getJSONObject("response");
			String responseCode = response.getString("application_response_code");
			
			if (isLocationUnambiguous(responseCode) ||
			    isBestGuessLocation(responseCode) ||
			    isLargeLocation(responseCode)) {
				PropertyDataSourceResult result = new PropertyListingsResult(json);
				complete.complete(result);
			}
			else if (isLocationAmbiguous(responseCode) ||
			         isLocationMisspelled(responseCode)) {
				PropertyDataSourceResult result = new PropertyLocationsResult(json);
				complete.complete(result);
			}
			else {
				fail(complete);
			}
		}
		catch (JSONException e) {
		    android.util.Log.e(TAG, "jsonerror: " + e.getMessage());
			error.complete(e);
		}
		catch (IndexOutOfBoundsException e) {
		    android.util.Log.e(TAG, "index out of bounds");
		    error.complete(e);
		}
	}
	
	private boolean isLocationUnambiguous(String responseCode) {
        return responseCode.equals("100");
    }
	
	private boolean isBestGuessLocation(String responseCode) {
        return responseCode.equals("101");
    }

    private boolean isLargeLocation(String responseCode) {
        return responseCode.equals("110");
    }
    
    private boolean isLocationAmbiguous(String responseCode) {
        return responseCode.equals("200");
    }
    
    private boolean isLocationMisspelled(String responseCode) {
        return responseCode.equals("202");
    }
    
	private void fail(Callback<PropertyDataSourceResult> complete) {
		PropertyDataSourceResult result = new PropertyUnknownLocationResult();
		complete.complete(result);
	}
}