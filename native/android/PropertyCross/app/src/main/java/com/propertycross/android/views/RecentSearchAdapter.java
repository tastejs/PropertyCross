package com.propertycross.android.views;

import java.util.List;

import com.propertycross.android.R;
import com.propertycross.android.presenter.RecentSearch;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class RecentSearchAdapter extends ArrayAdapter<RecentSearch> {

	private Context context;
	private List<RecentSearch> data;
	
	public RecentSearchAdapter(Context context, List<RecentSearch> data) {
		super(context, android.R.layout.simple_list_item_1, data);
		this.context = context;
		this.data = data;
	}
	
	@Override
	public int getCount() {
		return data.size();
	}
	
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View view = convertView;
		RecentSearchHolder holder;

		if(view == null)
		{
			LayoutInflater li = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			view = li.inflate(R.layout.recent_search_row, parent, false);

			holder = new RecentSearchHolder();
			holder.SearchText = (TextView) view.findViewById(R.id.recent_search_text);
			holder.ResultsCount = (TextView) view.findViewById(R.id.recent_search_count);
			view.setTag(R.layout.recent_search_row, holder);
		}
		else
		{
			holder = (RecentSearchHolder) view.getTag(R.layout.recent_search_row);
		}

		RecentSearch item = data.get(position);
		holder.SearchText.setText(item.getSearch().getDisplayText(), TextView.BufferType.NORMAL);

			String c = String.format(
					context.getResources().getString(R.string.recent_searches_count_format),
			        item.getResultsCount());
		holder.ResultsCount.setText(c, TextView.BufferType.NORMAL);

		return view;
	}
	
	private class RecentSearchHolder
	{
		public TextView SearchText;
		public TextView ResultsCount;
	}
}
