package com.propertycross.android.views;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ListView;

import com.actionbarsherlock.app.SherlockListActivity;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;

public class SearchResultsView extends SherlockListActivity {

	private View footer;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		
		LayoutInflater li = (LayoutInflater) this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		footer = li.inflate(R.layout.load_more_footer, null);
		
		getListView().addFooterView(footer);
		//setListAdapter(...);
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		/* if (item.getItemId() == android.R.id.home) {
			finish();
			return true;
		} */
		
		return super.onOptionsItemSelected(item);
	}
	
	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		
	}
	
}
