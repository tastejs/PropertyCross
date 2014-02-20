package com.propertycross.neomad.model;

import java.util.Vector;

import com.neomades.json.JSONArray;
import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;

/**
 * @author Neomades
 */
public class PropertyList {

	private int count;
	private int page;
	private int pages;
	private Vector data;

	public int getCount() {
		return count;
	}

	public int getPage() {
		return page;
	}

	public int getPages() {
		return pages;
	}

	public Vector getData() {
		return data;
	}

	public static PropertyList valueOf(JSONObject json) {
		PropertyList l = new PropertyList();
		try {
			JSONObject res = json.getJSONObject("response");

			l.count = res.getInt("total_results");
			l.page = res.getInt("page");
			l.pages = res.getInt("total_pages");

			JSONArray list = res.getJSONArray("listings");

			l.data = new Vector();

			for (int i = 0; i < list.length(); i++) {
				l.data.addElement(Property.valueOf(list.getJSONObject(i)));
			}
		} catch (JSONException ex) {
			l.data = new Vector();
			l.count = 0;
			l.page = 0;
			l.pages = 0;
		}
		return l;
	}
}
