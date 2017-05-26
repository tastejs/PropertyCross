package com.propertycross.android.model;

import com.propertycross.android.events.Callback;

public interface IJsonPropertySearch {
	
	public void findProperties(String searchText, int pageNumber,
			Callback<String> complete, Callback<Exception> error);
	
	public void findProperties(double latitude, double longitude, int pageNumber,
			Callback<String> complete, Callback<Exception> error);
}