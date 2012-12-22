package com.propertycross.android.services;

import java.util.Date;

import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.propertycross.android.events.Callback;
import com.propertycross.android.presenter.GeoLocation;
import com.propertycross.android.presenter.IGeoLocationService;
import com.propertycross.android.presenter.IMarshalInvokeService;

public class GeoLocationService implements IGeoLocationService, LocationListener {

	private final long FIVE_MINUTES = 1000 * 60 * 5;
	private final long SEVEN_SECONDS = 1000 * 7;
	private LocationManager manager;
	private Callback<GeoLocation> callback;
	private IMarshalInvokeService marshal;
	
	public GeoLocationService(LocationManager locationManager, IMarshalInvokeService marshalService) {
		this.manager = locationManager;
		this.marshal = marshalService;
	}
	
	public void getLocation(Callback<GeoLocation> callback) {
		this.callback = callback;
		
		Criteria c = new Criteria();
		c.setAccuracy(Criteria.ACCURACY_FINE);
		
		String provider = manager.getBestProvider(c, true);
		if(provider != null) {
			doCallback(null);
		}
		else {
			Location l = manager.getLastKnownLocation(provider);
			if (isLastLocationAccurateEnough(l)) {
				doCallback(toGeoLocation(l));
			}
			
			manager.requestLocationUpdates(provider, 1000, 10, this);
		}
	}
	
	private boolean isLastLocationAccurateEnough(Location l) {
		return l != null && l.getTime() >= unixTimeNow() - FIVE_MINUTES;
	}
	
	private long unixTimeNow() {
		return new Date().getTime();
	}
	
	private GeoLocation toGeoLocation(Location l) {
		return new GeoLocation(l.getLatitude(), l.getLongitude());
	}
	
	private void doCallback(GeoLocation g) {
		if (callback != null) {
			callback.complete(g);
			callback = null;
		}
	}	
	
	@Override
	public void onLocationChanged(Location location) {
		unsubscribe();
		
		if (location != null) {
			doCallback(toGeoLocation(location));
		}		
	}

	@Override
	public void onProviderDisabled(String provider) {
		unsubscribe();
	}

	@Override
	public void onProviderEnabled(String provider) {
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
	}
	
	public void unsubscribe() {
		if (manager != null) {
			manager.removeUpdates(this);
		}
	}
}
