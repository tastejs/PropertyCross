package com.propertycross.android.presenter;

import com.propertycross.android.events.Callback;

public interface IGeoLocationService {
	void getLocation(Callback<GeoLocation> callback);
}
