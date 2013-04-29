package com.propertycross.android.views;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Html;
import android.text.Spannable;
import android.text.style.StyleSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

import com.actionbarsherlock.app.SherlockListActivity;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;
import com.propertycross.android.events.Callback;
import com.propertycross.android.events.PropertyEventArgs;
import com.propertycross.android.events.PropertySelectedEvent;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.Property;
import com.propertycross.android.presenter.SearchResultsPresenter;

public class SearchResultsView 
	extends SherlockListActivity
	implements SearchResultsPresenter.View {

	private View footer;
	private TextView resultDetails;
	private SearchResultsPresenter presenter;
	private Callback<UIEvent> loadMoreCallback;
	private Callback<PropertySelectedEvent> propertySelectedCallback;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		
		LayoutInflater li = (LayoutInflater) this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		footer = li.inflate(R.layout.load_more_footer, null);
		footer.setOnClickListener(new View.OnClickListener(){

			@Override
			public void onClick(View v) {
				if (loadMoreCallback != null){
					loadMoreCallback.complete(new UIEvent(this));
				}
			}
			
		});
		resultDetails = (TextView) footer.findViewById(R.id.result_details);
		
		getListView().addFooterView(footer);
		setListAdapter(new SearchResultsAdapter(this, new ArrayList<Property>()));
		
		PropertyFinderApplication app = PropertyFinderApplication.getApplication(this);
		presenter = (SearchResultsPresenter) app.presenter;
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
	public void setSearchResults(int totalResult, int pageNumber,
			int totalPages, List<Property> properties, String searchLocation) {
		
		// Format the text:
		// Results for x, showing y of z properties.
		String text = String.format(getResources().getString(R.string.result_details),
				searchLocation, properties.size(), totalResult);
		resultDetails.setText(Html.fromHtml(text));
		
		((SearchResultsAdapter) getListAdapter()).addRange(properties);
		getSupportActionBar().setTitle(String.format(
				getResources().getString(R.string.results_shown),
				properties.size(), totalResult));
	}

	@Override
	public void setLoadMoreVisible(boolean isVisible) {
		/*
		 * List View footers cannot be hidden easily because they're wrapped
		 * in an enclosing View. Instead, remove the footer and add it back
		 * if necessary.
		 */
		getListView().removeFooterView(footer);
		if (isVisible)
		{
			getListView().addFooterView(footer);
		} 
	}

	@Override
	public void setIsLoading(boolean isLoading) {
		footer.setEnabled(!isLoading);
		if (isLoading) {
			resultDetails.setText(R.string.loading);
		}
	}

	@Override
	public void loadMoreClicked(Callback<UIEvent> callback) {
		loadMoreCallback = callback;
	}

	@Override
	public void propertySelected(Callback<PropertySelectedEvent> callback) {
		propertySelectedCallback = callback;
	}	
}