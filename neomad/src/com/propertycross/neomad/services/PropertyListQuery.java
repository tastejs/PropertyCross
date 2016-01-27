package com.propertycross.neomad.services;

import java.util.Vector;

import com.neomades.content.ContentQuery;
import com.neomades.content.Method;
import com.neomades.util.URLUtils;
import com.propertycross.neomad.Constants;

public class PropertyListQuery extends ContentQuery {

	private static final String SERVICE_BASE_URL = "http://api.nestoria.co.uk/api?";
	private static Vector commons = new Vector();

	static {
		commons.addElement(new UrlPart("country", "uk"));
		commons.addElement(new UrlPart("pretty", "1"));
		commons.addElement(new UrlPart("action", "search_listings"));
		commons.addElement(new UrlPart("encoding", "json"));
		commons.addElement(new UrlPart("listing_type", "buy"));
	}
	
	public PropertyListQuery(String url) {
		super(Method.GET, url);
		
		setCacheType(Constants.PROPERTIES_CACHE);
		setNetworkType(Constants.HTTP);
		setResponseParserType(Constants.PROPERTY_PARSER);
		setContentResponseType(Constants.EVENT_PROPERTY_LIST);
	}
	
	public PropertyListQuery(String location, Integer page) {
		this(getUrlSearchByName(location, page));
	}
	
	public PropertyListQuery(double latitude, double longitude, Integer page) {
		this(getUrlSearchByLocation(latitude, longitude, page));
	}
	
	
	private static final String getUrlSearchByName(String name, Integer page) {
		Vector parts = new Vector();
		parts.addElement(new UrlPart("place_name", name));
		parts.addElement(new UrlPart("page", page));
		return buildUrl(parts);
	}
	
	private static final String getUrlSearchByLocation(double latitude, double longitude, Integer page) {
		Vector parts = new Vector();
		String coord = new Double(latitude) + "," + new Double(longitude);
		parts.addElement(new UrlPart("centre_point", coord));
		parts.addElement(new UrlPart("page", page));
		return buildUrl(parts);
	}
	
	private static final String buildUrl(Vector parts) {
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
