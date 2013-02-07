package com.propertycross.android.services;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;

import com.propertycross.android.model.Property;
import com.propertycross.android.presenter.GeoLocation;
import com.propertycross.android.presenter.IStatePersistenceService;
import com.propertycross.android.presenter.PropertyFinderPersistentState;
import com.propertycross.android.presenter.RecentSearch;
import com.propertycross.android.presenter.searchitems.GeoLocationSearchItem;
import com.propertycross.android.presenter.searchitems.PlainTextSearchItem;
import com.propertycross.android.presenter.searchitems.SearchItem;
import com.propertycross.android.views.PropertyFinderApplication;

public class StatePersistenceService implements IStatePersistenceService {

	private final String FILENAME = "data.json";
	private PropertyFinderApplication application;

	private final String Favourites = "favourites";
	private final String Recents = "recents";
	private final String Geolocation = "geo_location";
	private final String Plaintext = "plain_text";

	public StatePersistenceService(PropertyFinderApplication app) {
		application = app;
	}

	@Override
	public void saveState(PropertyFinderPersistentState state) {
		FileOutputStream stream = null;

		try {

			JSONObject obj = new JSONObject();

			// FAVOURITES
			JSONArray favArr = new JSONArray();
			for (Property p : state.getFavourites()) {

				JSONObject property = new JSONObject();
				property.put("guid", p.getGuid());
				property.put("price", p.getPrice());
				property.put("property_type", p.getPropertyType());
				property.put("bedroom_number", p.getBedrooms());
				property.put("bathroom_number", p.getBathrooms());
				property.put("title", p.getTitle());
				property.put("thumb_url", p.getThumbnailUrl());
				property.put("img_url", p.getImageUrl());
				property.put("summary", p.getSummary());

				favArr.put(property);
			}
			obj.put(Favourites, favArr);

			// RECENT SEARCHES
			JSONArray searchArr = new JSONArray();
			for (RecentSearch r : state.getRecentSearches()) {

				JSONObject recent = new JSONObject();
				recent.put("results_count", r.getResultsCount());

				SearchItem searchItem = r.getSearch();

				JSONObject si = new JSONObject();
				if (searchItem instanceof GeoLocationSearchItem) {

					JSONObject geoObject = new JSONObject();

					GeoLocationSearchItem g = (GeoLocationSearchItem) searchItem;

					geoObject.put("latitude", g.getLocation().getLongitude());
					geoObject.put("longitude", g.getLocation().getLatitude());

					si.put(Geolocation, geoObject);
				} else if (searchItem instanceof PlainTextSearchItem) {
					JSONObject plainObject = new JSONObject();

					PlainTextSearchItem p = (PlainTextSearchItem) searchItem;

					plainObject.put("search_text", p.getSearchText());

					si.put(Plaintext, plainObject);
				}

				recent.put("search", si);

				searchArr.put(recent);

			}
			obj.put(Recents, searchArr);
			String json = obj.toString();

			// File writing
			stream = application.currentActivity.openFileOutput(FILENAME,
					Context.MODE_PRIVATE);
			OutputStreamWriter osw = new OutputStreamWriter(stream);
			osw.write(json);
			osw.flush();
			osw.close();
		} catch (JSONException e) {

		} catch (IOException e) {

		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e) {

				}
			}
		}
	}

	@Override
	public PropertyFinderPersistentState loadState() {

		PropertyFinderPersistentState state = new PropertyFinderPersistentState(
				this);
		FileInputStream stream = null;

		try {
			stream = application.openFileInput(FILENAME);

			BufferedReader reader = new BufferedReader(new InputStreamReader(
					stream));

			final StringBuilder builder = new StringBuilder();
			for (String line = null; (line = reader.readLine()) != null;) {
				builder.append(line);
			}

			String json = builder.toString();

			if (json != null) {

				List<Property> favourites = new ArrayList<Property>();
				List<RecentSearch> recents = new ArrayList<RecentSearch>();

				JSONObject obj = new JSONObject(json);

				// FAVOURITES
				JSONArray faves = obj.getJSONArray(Favourites);
				for (int i = 0; i < faves.length(); i++) {
					favourites.add(new Property(faves.getJSONObject(i)));
				}
				state.setFavourites(favourites);

				// RECENTS
				JSONArray re = obj.getJSONArray(Recents);
				for (int i = 0; i < re.length(); i++) {
					JSONObject j = re.getJSONObject(i);
					int count = j.getInt("results_count");

					JSONObject search = j.getJSONObject("search");

					SearchItem searchItem = null;

					if (search.has(Geolocation)) {
						JSONObject g = j.getJSONObject(Geolocation);
						double lon = g.getDouble("longitude");
						double lat = g.getDouble("latitude");
						searchItem = new GeoLocationSearchItem(new GeoLocation(
								lat, lon));
					}

					else if (search.has(Plaintext)) {
						JSONObject p = j.getJSONObject(Plaintext);
						String searchText = p.getString("search_text");
						searchItem = new PlainTextSearchItem(searchText);
					}

					recents.add(new RecentSearch(searchItem, count));
				}
				state.setRecentSearches(recents);
			}
		} catch (IOException e) {

		} catch (JSONException e) {

		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e) {

				}
			}
		}

		return state;
	}

}
