package com.propertycross.android.presenter.searchitems;

import com.propertycross.android.events.Callback;
import com.propertycross.android.model.PropertyDataSource;
import com.propertycross.android.model.PropertyDataSourceResult;
import com.propertycross.android.presenter.GeoLocation;

public class GeoLocationSearchItem extends SearchItem {
	private GeoLocation location;
	private String displayText;

	public GeoLocationSearchItem() {
	}

	public GeoLocationSearchItem(GeoLocation location) {
		this.location = location;
		this.displayText = String.format("{0:F2}, {1:F2}",
				new Object[] {
					Double.valueOf(location.getLatitude()),
					Double.valueOf(location.getLongitude())
				});
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String text) {
		displayText = text;
	}

	public GeoLocation getLocation() {
		return location;
	}

	public void setLocation(GeoLocation location) {
		this.location = location;
	}

	public void findProperties(PropertyDataSource source, int pageNumber,
			Callback<PropertyDataSourceResult> complete, Callback<Exception> error) {
		source.findProperties(location.getLatitude(), location.getLongitude(), pageNumber, complete, error);
	}
}
