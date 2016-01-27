package com.propertycross.neomad.screen.adapter.list;

import java.util.Vector;

import com.neomades.ui.ListAdapter;
import com.neomades.ui.View;
import com.propertycross.neomad.screen.adapter.holder.RecentSearchView;
import com.propertycross.neomad.screen.adapter.holder.ViewHolder;

/**
 * @author Neomades
 */
public final class RecentSearchListAdapter implements ListAdapter {

	private Vector items = new Vector();

	public View getView(int i, View convertView, View list) {
		View item = convertView;
		if (item == null) {
			item = buildItemView();
		}
		updateView(i, item);
		return item;
	}

	public int getCount() {
		return items.size();
	}

	private View buildItemView() {
		return new RecentSearchView().getView();
	}

	private void updateView(int i, View view) {
		Object tag = view.getTag();
		if (tag != null) {
			((ViewHolder) tag).update(items.elementAt(i));
		}
	}

	public void setItems(Vector items) {
		this.items = items;
	}

	public Object getViewModel(int i) {
		return items.elementAt(i);
	}
}
