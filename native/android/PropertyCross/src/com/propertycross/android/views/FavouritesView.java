package com.propertycross.android.views;

import android.os.Bundle;
import android.view.View;
import android.widget.ListView;

import com.actionbarsherlock.app.SherlockListActivity;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;

public class FavouritesView extends SherlockListActivity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		getSupportActionBar().setTitle(
				getResources().getString(R.string.favourites_view));
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		
		//setListAdapter(...);
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		/*if (item.getItemId() == android.R.id.home) {
			finish();
			return true;
		} */
		
		return super.onOptionsItemSelected(item);
	}
	
	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		
	}
	
}
