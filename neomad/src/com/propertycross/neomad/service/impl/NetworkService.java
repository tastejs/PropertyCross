package com.propertycross.neomad.service.impl;

import java.util.Vector;

import com.neomades.io.Network;
import com.neomades.io.http.HttpListener;
import com.neomades.io.http.HttpRequest;
import com.neomades.io.http.HttpResponse;
import com.neomades.json.JSONObject;
import com.neomades.util.URLUtils;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.event.SearchEvent;
import com.propertycross.neomad.service.EventListener;
import com.propertycross.neomad.service.PropertyService;

/**
 * @author Neomades
 */
public class NetworkService extends PropertyService {

	public static final String SERVICE_NAME = "NetworkService";
	private static final String SERVICE_BASE_URL = "http://api.nestoria.co.uk/api?";
	private static Vector commons = new Vector();

	static {
		commons.addElement(new UrlPart("country", "uk"));
		commons.addElement(new UrlPart("pretty", "1"));
		commons.addElement(new UrlPart("action", "search_listings"));
		commons.addElement(new UrlPart("encoding", "json"));
		commons.addElement(new UrlPart("listing_type", "buy"));
	}

	public NetworkService(EventListener busService) {
		super(busService);
	}

	private void findByLocationName(String location, Integer page,
			final String target) {
		runRequest(target, Event.Type.FIND_BY_NAME_RES,
				findByLocationQuery(location, page));
	}

	private void findByLocationPlace(Double latitude, Double longitude,
			Integer page, final String target) {
		runRequest(target, Event.Type.FIND_BY_LOCATION_RES,
				findByLocationQuery(latitude, longitude, page));
	}

	private void runRequest(final String target, final char event, String query) {
		runAsync(query, new HttpListener() {
			public void onHttpResponse(HttpRequest httpRequest,
					HttpResponse httpResponse) {
				if (httpResponse.isSuccess()) {
					String json = httpResponse.getDataString();
					send(new Event(json, SERVICE_NAME, target, handle(json,
							event)));
				}
			}
		});
	}

	private char handle(String json, char event) {
		try {
			JSONObject response = new JSONObject(json)
					.getJSONObject("response");
			String code = response.getString("application_response_code");
			if (isUnambiguous(code) || isBestGuess(code) || isLarge(code)) {
				return event;
			} else if (isAmbiguous(code) || isMisspelled(code)) {
				return Event.Type.FOUND_AMBIGIOUS_RES;
			}
		} catch (Exception ex) {
			// do nothing
		}
		return Event.Type.FIND_ERROR;
	}

	private boolean isUnambiguous(String responseCode) {
		return responseCode.equals("100");
	}

	private boolean isBestGuess(String responseCode) {
		return responseCode.equals("101");
	}

	private boolean isLarge(String responseCode) {
		return responseCode.equals("110");
	}

	private boolean isAmbiguous(String responseCode) {
		return responseCode.equals("200");
	}

	private boolean isMisspelled(String responseCode) {
		return responseCode.equals("202");
	}

	private String findByLocationQuery(String location, Integer page) {
		Vector parts = new Vector();
		parts.addElement(new UrlPart("place_name", location));
		parts.addElement(new UrlPart("page", page));
		return buildUrl(parts);
	}

	private String findByLocationQuery(Double latitude, Double longitude,
			Integer page) {
		Vector parts = new Vector();
		parts.addElement(new UrlPart("centre_point", latitude + "," + longitude));
		parts.addElement(new UrlPart("page", page));
		return buildUrl(parts);
	}

	private String buildUrl(Vector parts) {
		Vector plist = new Vector();
		for (int i = 0; i < commons.size(); i++) {
			plist.addElement(commons.elementAt(i));
		}
		for (int i = 0; i < parts.size(); i++) {
			plist.addElement(parts.elementAt(i));
		}
		String url = SERVICE_BASE_URL;
		url += plist.elementAt(0);
		for (int i = 1; i < plist.size(); i++) {
			url += "&" + plist.elementAt(i);
		}
		return url;
	}

	private void runAsync(String url, HttpListener listener) {
		new HttpRequest(url).executeAsync(listener);
	}

	public void receive(Event e) {
		SearchEvent m = (SearchEvent) e;
		String target = m.getSender().toString();
		if (Network.isConnected()) {
			if (e.getType() == Event.Type.FIND_BY_NAME) {
				findByLocationName(m.getLocation(), m.getPage(), target);
			}
			if (e.getType() == Event.Type.FIND_BY_LOCATION) {
				findByLocationPlace(m.getLatitude(), m.getLongitude(),
						m.getPage(), target);
			}
		} else {
			send(new Event(null, SERVICE_NAME, target, Event.Type.NETWORK_ERROR));
		}
	}

	private static final class UrlPart {
		private String param;
		private Object value;

		private UrlPart(String param, Object value) {
			this.param = param;
			this.value = value;
		}

		public String toString() {
			return param + "=" + URLUtils.encodeUTF8(String.valueOf(value));
		}
	}
}
