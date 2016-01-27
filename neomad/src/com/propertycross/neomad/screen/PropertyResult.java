package com.propertycross.neomad.screen;

import java.util.Vector;

import com.neomades.app.ScreenParams;
import com.neomades.event.Event;
import com.neomades.ui.ListView;
import com.neomades.ui.View;
import com.neomades.ui.listeners.ItemClickedListener;
import com.propertycross.neomad.Constants;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.model.Property;
import com.propertycross.neomad.model.PropertyList;
import com.propertycross.neomad.model.SearchResult;
import com.propertycross.neomad.model.search.LocationSearch;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.screen.adapter.holder.LoadMoreView;
import com.propertycross.neomad.screen.adapter.list.PropertyListAdapter;
import com.propertycross.neomad.screen.adapter.screen.ScreenAdapter;

/**
 * @author Neomades
 */
public class PropertyResult extends ScreenAdapter implements
		ItemClickedListener {

	private boolean loading = false;

	private ListView list;
	private Search query;
	private PropertyListAdapter adapter;

	private int count;
	private int total;

	protected void onCreate() {
		this.registerEvent(Constants.EVENT_PROPERTY_LIST);
		setContent(Res.layout.PROPERTY_SEARCH_SCREEN);
		setShortTitle(Res.string.RESULTS);
		init();
	}

	protected void init() {
		super.init();
		list = (ListView) findView(Res.id.PROPERTY_LIST);
		list.setItemClickedListener(this);
		adapter = new PropertyListAdapter(this);
		list.setListAdapter(adapter);
		list.setItemTypeAdapter(adapter);
		PropertyList properties = (PropertyList) getScreenParams().getObject(
				PropertyList.class.getName());
		query = (Search) getScreenParams().getObject(Search.class.getName());
		Vector items = properties.getData();
		count = items.size();
		total = properties.getCount();
		adapter.setModel(items, query, total);
		update();
	}

	public void onItemClicked(int i, View view) {
		if (!loading
				&& adapter.getItemViewType(i) == PropertyListAdapter.TYPE_LOAD_MORE) {
			loading = true;
			((LoadMoreView) view.getTag()).start();
			LocationSearch eventValue = new LocationSearch(query.getQuery(),
					query.getPage() + 1);
			send(new Event(eventValue, this, Constants.FIND_BY_NAME));

		} else if (adapter.getItemViewType(i) == PropertyListAdapter.TYPE_ITEM) {
			ScreenParams values = new ScreenParams();
			values.putObject(Property.class.getName(), adapter.getViewModel(i));
			values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
			controller.pushScreen(PropertyDetail.class, values);
		}
	}

	public void onReceiveEvent(Event event) {
		if (event.hasType(Constants.EVENT_PROPERTY_LIST)) {
			handle(((SearchResult) event.getValue()).getPropertyList());
			update();
		}
		loading = false;
	}

	protected void update() {
		list.notifyDataChanged();
		updateTitle();
	}

	private void handle(Object data) {
		PropertyList properties = (PropertyList) data;
		Vector items = properties.getData();
		query.setPage(properties.getPage());
		count += items.size();
		total = properties.getCount();
		adapter.setModel(items, query, total);

		update();
	}

	protected void updateTitle() {
		updateTitle(count + " of " + total + " matches");
	}

	public boolean hasLazyLoading() {
		// will add LoadMore view for pagination
		return true;
	}
}