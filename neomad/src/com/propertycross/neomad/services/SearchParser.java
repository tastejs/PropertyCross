package com.propertycross.neomad.services;

import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.model.search.LocationSearch;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.model.search.Search;

public class SearchParser {
	
	private static final String TEXT_SEARCH = "text_search";
	private static final String GEO_SEARCH = "geo_search";
	private static final String SEARCH_QUERY = "search_query";
	private static final String SEARCH_LABEL = "search_label";
	private static final String SEARCH_COUNT = "search_count";
	private static final String SEARCH_TYPES = "search_types";
	
	public static RecentSearch valueOf(JSONObject json) throws JSONException {
		int count = json.getInt(SEARCH_COUNT);
		JSONObject search = json.getJSONObject(SEARCH_TYPES);
		Search type = null;

		if (search.has(TEXT_SEARCH)) {
			JSONObject p = search.getJSONObject(TEXT_SEARCH);
			String label = p.getString(SEARCH_QUERY);
			type = new LocationSearch(label, 1);
		}

		if (search.has(GEO_SEARCH)) {
			JSONObject p = search.getJSONObject(GEO_SEARCH);
			String query = p.getString(SEARCH_QUERY);
			String label = p.getString(SEARCH_LABEL);
			type = new LocationSearch(label, query, 1);
		}	
		return new RecentSearch(type, count);
	}
	
	public static JSONObject serialize(RecentSearch search) throws JSONException {
		JSONObject recent = new JSONObject();
		recent.put(SEARCH_COUNT, search.getCount());
		Search type = search.getSearch();
		JSONObject si = new JSONObject();
		JSONObject text = new JSONObject();
		LocationSearch p = (LocationSearch) type;
		text.put(SEARCH_QUERY, p.getQuery());
		text.put(SEARCH_LABEL, p.getLabel());
		si.put(GEO_SEARCH, text);
		recent.put(SEARCH_TYPES, si);
		
		return recent;
		
	}

}
