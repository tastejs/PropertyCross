package com.propertycross.neomad.adapter.screen;

import java.util.Vector;

import com.neomades.json.JSONException;
import com.neomades.json.JSONObject;
import com.neomades.ui.ListView;
import com.neomades.ui.listeners.ItemClickedListener;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.PropertyListAdapter;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.utils.Log;

/**
 * @author Neomades
 */
public abstract class PropertyResultAdapter extends ScreenAdapter implements
		ItemClickedListener {

	public static final String QUERY = "query";
	public static final String SERVICE_NAME = "PropertyResult";
	
	private ListView list;
	private Search query;
	private int page;
	private PropertyListAdapter adapter;

	protected Search getQuery() {
		return query;
	}

	protected int getPage() {
		return page;
	}
	
	

	protected PropertyListAdapter getAdapter() {
		return adapter;
	}

	private int count;
	private int total;
	

	public String getName() {
		return SERVICE_NAME;
	}

	public void init() {
		super.init();
		list = (ListView) findView(Res.id.PROPERTY_LIST);
		list.setItemClickedListener(this);
		adapter = new PropertyListAdapter(this);
		list.setListAdapter(adapter);
		list.setItemTypeAdapter(adapter);
		PropertyList properties = (PropertyList) getScreenParams().getObject(
				PropertyList.class.getName());
		page = properties.getPage();
		query = (Search) getScreenParams().getObject(
				Search.class.getName());
		Vector items = properties.getData();
		count = items.size();
		total = properties.getCount();
		adapter.setModel(items, query, total);
		update();
	}

	protected void update() {
		list.notifyDataChanged();
		updateTitle();
	}

	public void receive(Event e) {
		if (e.getType() == Event.Type.FIND_BY_NAME_RES) {
			handle(e.getValue());
			update();
		}
	}

	private void handle(Object data) {
		try {
			PropertyList properties = PropertyList.valueOf(new JSONObject(data
					.toString()));
			Vector items = properties.getData();
			page = properties.getPage();
			count += items.size();
			total = properties.getCount();
			adapter.setModel(items, query, total);
		} catch (JSONException ex) {
			// do nothing
			Log.d(ex.getMessage());
		}
	}

	protected void updateTitle() {
		updateTitle(count + " of " + total + " matches");
	}
}
