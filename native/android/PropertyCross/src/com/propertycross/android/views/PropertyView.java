package com.propertycross.android.views;

import android.os.Bundle;

import com.actionbarsherlock.app.SherlockActivity;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;

public class PropertyView extends SherlockActivity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.property_view);
		
		getSupportActionBar().setTitle(
				getResources().getString(R.string.property_title));
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getSupportMenuInflater().inflate(R.menu.favourites_toggle, menu);
		return true;
	}
	
	@Override
	public boolean onPrepareOptionsMenu(Menu menu) {
		MenuItem addItem = menu.findItem(R.id.favourites_add_item);
		//addItem.setVisible(!IsFavourited);
		
		MenuItem removeItem = menu.findItem(R.id.favourites_remove_item);
		//removeItem.setVisible(IsFavourited);
		
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		/*if (item.getItemId() == android.R.id.home) {
			finish();
			return true;
		}
		
		if ((item.getItemId() == R.id.favourited_add_item && !Isfavourited) ||
			(item.getItemId() == R.id.favourites_remove_item && IsFavourited)) {
			// handle toggle favourite
			return true;
		}
		else {
			return super.onOptionsItemSelected(item);
		} */
		return super.onOptionsItemSelected(item);
	}
	
}
