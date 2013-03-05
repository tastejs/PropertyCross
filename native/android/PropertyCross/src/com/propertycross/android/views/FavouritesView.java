package com.propertycross.android.views;

import java.util.ArrayList;
import java.util.List;

import android.os.Bundle;
import android.view.View;
import android.widget.ListView;

import com.actionbarsherlock.app.SherlockListActivity;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;
import com.propertycross.android.events.Callback;
import com.propertycross.android.events.PropertyEventArgs;
import com.propertycross.android.events.PropertySelectedEvent;
import com.propertycross.android.model.Property;
import com.propertycross.android.presenter.FavouritesPresenter;

public class FavouritesView
	extends SherlockListActivity
	implements FavouritesPresenter.View {

	private FavouritesPresenter presenter;
	private Callback<PropertySelectedEvent> propertySelectedCallback;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		getSupportActionBar().setTitle(
				getResources().getString(R.string.favourites_view));
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		
		setListAdapter(new SearchResultsAdapter(this, new ArrayList<Property>()));
		
		PropertyFinderApplication app = PropertyFinderApplication.getApplication(this);
		presenter = (FavouritesPresenter) app.presenter;
		presenter.setView(this);
		app.currentActivity = this;		
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		if (item.getItemId() == android.R.id.home) {
			finish();
			return true;
		}
		
		return super.onOptionsItemSelected(item);
	}
	
	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		Property item = ((SearchResultsAdapter) getListAdapter()).getItem(position);
		if (propertySelectedCallback != null) {
			propertySelectedCallback.complete(
					new PropertySelectedEvent(this, new PropertyEventArgs(item)));
		}
	}

	@Override
	public void setFavourites(List<Property> properties) {
		if(properties != null) {
			((SearchResultsAdapter) getListAdapter()).addRange(properties);
		}
	}

	@Override
	public void propertySelected(Callback<PropertySelectedEvent> callback) {
		propertySelectedCallback = callback;
	}	
}
