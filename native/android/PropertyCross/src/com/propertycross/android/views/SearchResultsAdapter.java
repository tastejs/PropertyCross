package com.propertycross.android.views;

import java.util.List;

import com.propertycross.android.R;
import com.propertycross.android.model.Property;
import com.propertycross.android.util.NetworkedCacheableImageView;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class SearchResultsAdapter extends BaseAdapter {

	private Context context;
	private List<Property> data;
	
	public SearchResultsAdapter(Context c, List<Property> data) {
		this.context = c;
		this.data = data;
	}
	
	@Override
	public int getCount() {
		return data.size();
	}

	@Override
	public Property getItem(int position) {
		return data.get(position);
	}

	@Override
	public long getItemId(int position) {
		return position;
	}
	
	public void addRange(List<Property> properties) {
		boolean hasChangedData = false;
		for(Property property : properties) {
			if(!data.contains(property)) {
				data.add(property);
				hasChangedData = true;
			}
		}
		if(hasChangedData) {
			notifyDataSetChanged();
		}
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View view = convertView;
		PropertySearchHolder holder;
		
		if(view == null) {
			
			LayoutInflater li = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			view = li.inflate(R.layout.property_search_row, parent, false);
			
			holder = new PropertySearchHolder();
			holder.PropertyThumbnail = (NetworkedCacheableImageView) view.findViewById(R.id.property_thumb);
			holder.PriceText = (TextView) view.findViewById(R.id.property_search_price);
			holder.DetailsText = (TextView) view.findViewById(R.id.property_search_details);
			
			view.setTag(R.layout.recent_search_row, holder);
		}
		else {
			holder = (PropertySearchHolder) view.getTag(R.layout.recent_search_row);
		}
		
		Property item = data.get(position);
		holder.PriceText.setText(item.getFormattedPrice());
		holder.DetailsText.setText(String.format(
				context.getResources().getString(R.string.property_summary),
				item.getShortTitle(),
				item.getBedrooms(),
				item.getPropertyType()));
		
		holder.PropertyThumbnail.loadImage(item.getThumbnailUrl(), false);
		
		return view;
	}
	
	private class PropertySearchHolder {
		public NetworkedCacheableImageView PropertyThumbnail;
		public TextView PriceText;
		public TextView DetailsText;
	}

}
