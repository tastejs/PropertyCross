package com.propertycross.android.views;

import com.actionbarsherlock.app.SherlockActivity;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;

import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;

public class PropertyFinderView extends SherlockActivity {

	private ProgressBar progress;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.property_finder_view);
		
		progress = (ProgressBar) findViewById(R.id.progress);
		progress.setVisibility(View.INVISIBLE);
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getSupportMenuInflater().inflate(R.menu.favourites_view, menu);
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		if (item.getItemId() == R.id.favourites_view_item) {
			// handle click
			return true;
		}
		else {
			return super.onOptionsItemSelected(item);
		}
	}

}
