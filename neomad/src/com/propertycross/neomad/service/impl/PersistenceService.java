package com.propertycross.neomad.service.impl;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Vector;

import com.neomades.app.Controller;
import com.neomades.io.file.File;
import com.neomades.io.file.FileInputStream;
import com.neomades.io.file.FileOutputStream;
import com.neomades.io.file.FileStorage;
import com.neomades.json.JSONArray;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.event.CallbackEvent;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.model.search.FullTextSearch;
import com.propertycross.neomad.model.search.GeoLocationSearch;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.service.PropertyService;
import com.propertycross.neomad.utils.Log;

/**
 * @author Neomades
 */
public class PersistenceService extends PropertyService {
	private static final int CHAR_BUFFER = 1024;
	public static final String SERVICE_NAME = "persistenceService";
	private static final String RECENTS = "recents";
	private static final String FAVOURITES = "favourites";
	private static final String TEXT_SEARCH = "text_search";
	private static final String GEO_SEARCH = "geo_search";
	private static final String SEARCH_QUERY = "search_query";
	private static final String SEARCH_LABEL = "search_label";
	private static final String SEARCH_COUNT = "search_count";
	private static final String SEARCH_TYPES = "search_types";
	private static final File DATA = new File(FileStorage.getPrivateDir(), "data.json");

	private static PersistenceState state;

	private static boolean keepInMemory = false;

	public PersistenceService(EventListener busService) {
		super(busService);
		state = new PersistenceState(this);
	}

	private void save(PersistenceState state) {
		try {
			JSONObject root = new JSONObject();

			insertFavourites(state, root);

			insertRecentSearches(state, root);
			
			writeJSONToFile(root);
			
			keepInMemory = false;
		} catch (JSONException e) {
			// ignore
			Log.d(e.getMessage());
		} 
	}

	private void insertRecentSearches(PersistenceState state, JSONObject root) throws JSONException {
		// SAVE RECENT SEARCHES
		JSONArray recents = new JSONArray();
		for (int i = 0; i < state.getSearches().size(); i++) {
			RecentSearch r = (RecentSearch) state.getSearches().elementAt(i);
			JSONObject recent = new JSONObject();
			recent.put(SEARCH_COUNT, r.getCount());
			Search type = r.getSearch();
			JSONObject si = new JSONObject();
			if (type instanceof FullTextSearch) {
				JSONObject text = new JSONObject();
				FullTextSearch p = (FullTextSearch) type;
				text.put(SEARCH_QUERY, p.getQuery());
				si.put(TEXT_SEARCH, text);
			} else if (type instanceof GeoLocationSearch) {
				JSONObject text = new JSONObject();
				GeoLocationSearch p = (GeoLocationSearch) type;
				text.put(SEARCH_QUERY, p.getQuery());
				text.put(SEARCH_LABEL, p.getLabel());
				si.put(GEO_SEARCH, text);
			}
			recent.put(SEARCH_TYPES, si);
			recents.put(recent);
		}
		root.put(RECENTS, recents);
	}

	private void insertFavourites(PersistenceState state, JSONObject root) throws JSONException {
		// FAVOURITES
		JSONArray favourites = new JSONArray();
		for (int i = 0; i < state.getFavourites().size(); i++) {
			Property p = (Property) state.getFavourites().elementAt(i);
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
			favourites.put(property);
		}
		root.put(FAVOURITES, favourites);
	}

	private void writeJSONToFile(JSONObject root) {
		OutputStreamWriter sw = null;
		try {
			String json = root.toString();
			sw = new OutputStreamWriter(new FileOutputStream(DATA));
			sw.write(json);
			sw.flush();
			sw.close();
		} catch (Exception e) {
			// ignore
			Log.d(e.getMessage());
		} finally {
			if (sw != null) {
				try {
					sw.close();
				} catch (IOException e) {
					// ignore
					Log.d(e.getMessage());
				}
			}
		}
	}

	private String readJSONFromFile() {
		String json = "";
		FileInputStream stream = null;
		try {
			stream = new FileInputStream(DATA);
			InputStreamReader reader = new InputStreamReader(stream);
			char[] buf = new char[CHAR_BUFFER];
			while (reader.read(buf) != -1) {
				json += new String(buf);
			}
		} catch (Exception e) {
			// ignore
			Log.d(e.getMessage());
		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (Exception ex) {
					// ignore
					Log.d(ex.getMessage());
				}
			}
		}
		return json;
	}

	private PersistenceState load() {
		if (!keepInMemory) {
			try {
				String json = readJSONFromFile();
				if (!"".equals(json)) {

					JSONObject root = new JSONObject(json);

					loadFavourites(root);

					loadRecentSearches(root);
				}
				keepInMemory = true;
			} catch (JSONException e) {
				// ignore
				Log.d(e.getMessage());
			}
		}
		return state;
	}

	private void loadRecentSearches(JSONObject root) throws JSONException {
		Vector recents = new Vector();
		JSONArray re = root.getJSONArray(RECENTS);
		for (int i = 0; i < re.length(); i++) {
			JSONObject j = re.getJSONObject(i);
			int count = j.getInt(SEARCH_COUNT);

			JSONObject search = j.getJSONObject(SEARCH_TYPES);

			Search type = null;

			if (search.has(TEXT_SEARCH)) {
				JSONObject p = search.getJSONObject(TEXT_SEARCH);
				String label = p.getString(SEARCH_QUERY);
				type = new FullTextSearch(label);
			}

			if (search.has(GEO_SEARCH)) {
				JSONObject p = search.getJSONObject(GEO_SEARCH);
				String query = p.getString(SEARCH_QUERY);
				String label = p.getString(SEARCH_LABEL);
				type = new GeoLocationSearch(label, query);
			}

			recents.addElement(new RecentSearch(type, count));
		}
		state.setSearches(recents);
	}

	private void loadFavourites(JSONObject root) throws JSONException {
		// LOAD FAVOURITES
		Vector favourites = new Vector();
		JSONArray favourite = root.getJSONArray(FAVOURITES);
		for (int i = 0; i < favourite.length(); i++) {
			favourites.addElement(Property.valueOf(favourite.getJSONObject(i)));
		}
		state.setFavourites(favourites);
	}

	private void save() {
		save(state);
	}

	public void close(Controller controller) {
		save();
	}

	public void receive(Event e) {
		if (e.getType() == Event.Type.SAVE) {
			save();
		} else if (e.getType() == Event.Type.LOAD) {
			if (e instanceof CallbackEvent) {
				((CallbackEvent) e).onComplete(load());
			}
		} else if ((e instanceof CallbackEvent) && (e.getType() == Event.Type.UPDATE)) {
			save((PersistenceState) e.getValue());
			((CallbackEvent) e).onComplete(load());
		}
	}
}
