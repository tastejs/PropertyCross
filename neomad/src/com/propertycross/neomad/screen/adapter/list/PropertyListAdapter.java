package com.propertycross.neomad.screen.adapter.list;

import java.util.Vector;

import com.neomades.ui.ItemTypeAdapter;
import com.neomades.ui.ListAdapter;
import com.neomades.ui.View;
import com.propertycross.neomad.model.MetaInfo;
import com.propertycross.neomad.model.search.Search;
import com.propertycross.neomad.screen.adapter.holder.LoadMoreView;
import com.propertycross.neomad.screen.adapter.holder.PropertyView;
import com.propertycross.neomad.screen.adapter.holder.ViewHolder;
import com.propertycross.neomad.screen.adapter.screen.ScreenAdapter;

/**
 * @author Neomades
 */
public final class PropertyListAdapter implements ListAdapter, ItemTypeAdapter {

	public static final int TYPE_ITEM = 0;
	public static final int TYPE_LOAD_MORE = 1;
	
	private Vector items = new Vector();
	
	private boolean lazy = false;

	public PropertyListAdapter(ScreenAdapter screen) {
		lazy = screen.hasLazyLoading();
	}

	public View getView(int i, View convertView, View list) {
		View item = convertView;
		if (item == null) {
			item = buildRowView(i);
		}
		updateView(i, item);
		return item;
	}

	public int getViewTypeCount() {
		return 2;
	}

	public int getItemViewType(int i) {
		return (getViewModel(i) instanceof MetaInfo) && lazy ? TYPE_LOAD_MORE
				: TYPE_ITEM;
	}

	public boolean isEnabled(int i) {
		return true;
	}

	public boolean areAllItemsEnabled() {
		return false;
	}

	public int getCount() {
		return items.size();
	}

	private View buildRowView(int i) {
		int type = getItemViewType(i);
		if (type == TYPE_LOAD_MORE) {
			return new LoadMoreView().getView();
		} else if (type == TYPE_ITEM) {
			return new PropertyView().getView();
		}
		return null;
	}

	private void updateView(int i, View view) {
		Object tag = view.getTag();
		if (tag != null) {
			((ViewHolder) tag).update(getViewModel(i));
		}
	}

	public Object getViewModel(int i) {
		return items.elementAt(i);
	}

	public void setModel(Vector items, Search query, int count) {
		if (lazy && this.items.size() > 0) {
			this.items.removeElementAt(this.getCount() - 1);
		}
		if (!lazy) {
			this.items.removeAllElements();
		}
		for (int i = 0; i < items.size(); i++) {
			this.items.addElement(items.elementAt(i));
		}
		if (lazy && getCount() < count) {
			this.items
					.addElement(new MetaInfo(query, this.items.size(), count));
		}
	}
}
