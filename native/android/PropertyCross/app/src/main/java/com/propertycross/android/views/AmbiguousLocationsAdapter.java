package com.propertycross.android.views;

import java.util.List;

import com.propertycross.android.model.Location;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class AmbiguousLocationsAdapter extends ArrayAdapter<Location> {

    private Context context;
    private List<Location> items;

    public AmbiguousLocationsAdapter(Context context, List<Location> items) {
        super(context, android.R.layout.simple_list_item_1, items);
        this.context = context;
        this.items = items;
        }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;

        if(view == null) {
            LayoutInflater li = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = li.inflate(android.R.layout.simple_list_item_1, parent, false);
            }

        Location item = items.get(position);
        if (item != null) {
            TextView text = (TextView) view.findViewById(android.R.id.text1);
            text.setText(item.getDisplayName());
        }

        return view;
    }

}
