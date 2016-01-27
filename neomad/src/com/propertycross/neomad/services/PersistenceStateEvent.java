package com.propertycross.neomad.services;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Vector;

import com.neomades.app.Application;
import com.neomades.app.Controller;
import com.neomades.event.Event;
import com.neomades.io.file.File;
import com.neomades.io.file.FileInputStream;
import com.neomades.io.file.FileOutputStream;
import com.neomades.io.file.FileStorage;
import com.neomades.json.JSONArray;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.model.PersistenceState;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.utils.Log;

public class PersistenceStateEvent extends Event {

	private static final int CHAR_BUFFER = 1024;
	public static final String SERVICE_NAME = "persistenceService";
	
	private static final String RECENTS = "recents";
	private static final String FAVOURITES = "favourites";
	
	private static final File DATA = new File(FileStorage.getPrivateDir(),
			"data.json");

	private static PersistenceState state;

	private static boolean keepInMemory = false;

	public PersistenceStateEvent(Object value, Object sender, String type) {
		super(value, sender, type);
		state = PersistenceState.getInstance();
		if (type == Constants.SAVE) {
			save();
		} else if (type == Constants.LOAD) {
			Application.getCurrent().getEventBus()
					.send(new Event(load(), this, Constants.LOAD_COMPLETE));
		} else if (type == Constants.UPDATE_FAVORITES) {
			save();
			Application
					.getCurrent()
					.getEventBus()
					.send(new Event(load(), this,
							Constants.UPDATE_FAVORITES_COMPLETE));
		}
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

	private void insertRecentSearches(PersistenceState state, JSONObject root)
			throws JSONException {
		// SAVE RECENT SEARCHES
		JSONArray recents = new JSONArray();
		
		for (int i = 0; i < state.getSearches().size(); i++) {
			recents.put(SearchParser.serialize((RecentSearch) state.getSearches().elementAt(i)));
		}
		root.put(RECENTS, recents);
	}

	private void insertFavourites(PersistenceState state, JSONObject root)
			throws JSONException {
		// FAVOURITES
		JSONArray favourites = new JSONArray();
		for (int i = 0; i < state.getFavourites().size(); i++) {
			favourites.put(PropertyParser.toJSONObject((Property) state
					.getFavourites().elementAt(i)));
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
		if (DATA.exists()) {
			try {
				stream = new FileInputStream(DATA);
				InputStreamReader reader = new InputStreamReader(stream);
				char[] buf = new char[CHAR_BUFFER];
				while (reader.read(buf) != -1) {
					json += new String(buf);
				}
			} catch (IOException e) {
				// ignore
				Log.d(e.getMessage());
			} finally {
				if (stream != null) {
					try {
						stream.close();
					} catch (IOException ex) {
						// ignore
						Log.d(ex.getMessage());
					}
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
			recents.addElement(SearchParser.valueOf(re.getJSONObject(i)));
		}
		state.setSearches(recents);
	}

	private void loadFavourites(JSONObject root) throws JSONException {
		// LOAD FAVOURITES
		Vector favourites = new Vector();
		JSONArray favourite = root.getJSONArray(FAVOURITES);
		for (int i = 0; i < favourite.length(); i++) {
			favourites.addElement(PropertyParser.valueOf(favourite
					.getJSONObject(i)));
		}
		state.setFavourites(favourites);
	}

	private void save() {
		save(state);
	}

	public void close(Controller controller) {
		save();
	}

}
