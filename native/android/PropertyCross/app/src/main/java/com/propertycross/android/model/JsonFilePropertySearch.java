package com.propertycross.android.model;

import com.propertycross.android.events.Callback;

public class JsonFilePropertySearch implements IJsonPropertySearch {

	public void findProperties(String location, int pageNumber,
			Callback<String> complete, Callback<Exception> error) {
	}

	public void findProperties(double latitude, double longitude, int pageNumber,
			Callback<String> complete, Callback<Exception> error) {
	}
}