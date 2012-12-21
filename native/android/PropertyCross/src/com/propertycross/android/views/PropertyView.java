package com.propertycross.android.views;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import com.actionbarsherlock.app.SherlockActivity;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.propertycross.android.R;
import com.propertycross.android.events.Callback;
import com.propertycross.android.events.UIEvent;
import com.propertycross.android.model.Property;
import com.propertycross.android.presenter.PropertyPresenter;
import com.propertycross.android.util.BitmapUtils;

public class PropertyView extends SherlockActivity implements PropertyPresenter.View {

	private PropertyPresenter presenter;
	private TextView priceText;
	private TextView locationText;
	private ImageView propertyImage;
	private TextView overviewText;
	private TextView informationText;
	private boolean isFavourited;
	private Callback<UIEvent> toggleFavouriteCallback;
	private Bitmap placeholder;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.property_view);
		
		getSupportActionBar().setTitle(
				getResources().getString(R.string.property_title));
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);
		
		priceText = (TextView) findViewById(R.id.property_price);
		locationText = (TextView) findViewById(R.id.property_location);
		propertyImage = (ImageView) findViewById(R.id.property_image);
		overviewText = (TextView) findViewById(R.id.property_overview);
		informationText = (TextView) findViewById(R.id.property_information);
		
		placeholder = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
		
		PropertyFinderApplication app = (PropertyFinderApplication) getApplicationContext();
		presenter = (PropertyPresenter) app.presenter;
		presenter.setView(this);
		app.currentActivity = this;
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getSupportMenuInflater().inflate(R.menu.favourites_toggle, menu);
		return true;
	}
	
	@Override
	public boolean onPrepareOptionsMenu(Menu menu) {
		MenuItem addItem = menu.findItem(R.id.favourites_add_item);
		addItem.setVisible(!isFavourited);
		
		MenuItem removeItem = menu.findItem(R.id.favourites_remove_item);
		removeItem.setVisible(isFavourited);
		
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		if (item.getItemId() == android.R.id.home) {
			finish();
			return true;
		}
		
		if ((item.getItemId() == R.id.favourites_add_item && !isFavourited) ||
			(item.getItemId() == R.id.favourites_remove_item && isFavourited)) {
			
			if (toggleFavouriteCallback != null) {
				toggleFavouriteCallback.complete(new UIEvent(this));
				return true;
			}
		}
		return super.onOptionsItemSelected(item);
	}

	@Override
	public void setProperty(Property property) {
		priceText.setText(property.getFormattedPrice());
		locationText.setText(property.getShortTitle());
		
		BitmapUtils.download(property.getImageUrl(), propertyImage, getResources(), placeholder);
		
		overviewText.setText(String.format(
				getResources().getString(R.string.property_details),
				property.getBedBathroomText(),
				property.getPropertyType()));
		
		informationText.setText(property.getSummary());
	}

	@Override
	public void setIsFavourited(boolean fave) {
		isFavourited = fave;
		supportInvalidateOptionsMenu();
	}

	@Override
	public void toggleFavourite(Callback<UIEvent> callback) {
		toggleFavouriteCallback = callback;
	}	
}
