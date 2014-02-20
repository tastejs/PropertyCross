package com.propertycross.neomad.screen;

import com.neomades.app.ScreenParams;
import com.neomades.ui.View;
import com.propertycross.neomad.Res;
import com.propertycross.neomad.adapter.PropertyListAdapter;
import com.propertycross.neomad.adapter.holder.LoadMoreView;
import com.propertycross.neomad.adapter.screen.PropertyResultAdapter;
import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.event.SearchEvent;
import com.propertycross.neomad.model.Property;

/**
 * @author Neomades
 */
public class PropertyResult extends PropertyResultAdapter {

	private boolean loading = false;

	protected void onCreate() {
		setContent(Res.layout.PROPERTY_SEARCH_SCREEN);
		setShortTitle(Res.string.RESULTS);
		init();
	}

	public void onItemClicked(int i, View view) {
		if (!loading && getAdapter().getItemViewType(i) == PropertyListAdapter.TYPE_LOAD_MORE) {
			loading = true;
			((LoadMoreView) view.getTag()).start();
			send(new SearchEvent(getName(), getQuery().getQuery(), getPage() + 1));
			
		} else if (getAdapter().getItemViewType(i) == PropertyListAdapter.TYPE_ITEM) {
			ScreenParams values = new ScreenParams();
			values.putObject(Property.class.getName(), getAdapter().getViewModel(i));
			values.putObject(EXTRA_PREVIOUS_SCREEN, getShortTitle());
			controller.pushScreen(PropertyDetail.class, values);
		}
	}

	public void receive(Event e) {
		super.receive(e);
		loading = false;
	}
	
	public boolean hasLazyLoading() {
		// will add LoadMore view for pagination
		return true;
	}
}
