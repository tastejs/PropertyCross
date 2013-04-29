package com.propertycross.android.model;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PropertyListingsResult extends PropertyDataSourceResult {

	private int totalResult;
	private int pageNumber;
	private int totalPages;
	private List<Property> data;

	public PropertyListingsResult(JSONObject result) {
		data = new ArrayList<Property>();
		try {
			JSONObject response = result.getJSONObject("response");
			totalResult = response.getInt("total_results");
			pageNumber = response.getInt("page");
			totalPages = response.getInt("total_pages");

			JSONArray listing = response.getJSONArray("listings");
			for (int i = 0; i < listing.length(); i++) {
				data.add(new Property(listing.getJSONObject(i)));
			}
		}
		catch (JSONException e) {
			data.clear();
			totalResult = 0;
			pageNumber = 0;
			totalPages = 0;
		}
	}

	public int getTotalResult() {
		return totalResult;
	}

	public int getPageNumber() {
		return pageNumber;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public List<Property> getData() {
		return data;
	}
}
