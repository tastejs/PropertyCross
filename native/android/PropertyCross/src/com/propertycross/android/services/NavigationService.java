package com.propertycross.android.services;

import android.content.Intent;

import com.propertycross.android.presenter.FavouritesPresenter;
import com.propertycross.android.presenter.INavigationService;
import com.propertycross.android.presenter.PropertyPresenter;
import com.propertycross.android.presenter.SearchResultsPresenter;
import com.propertycross.android.views.FavouritesView;
import com.propertycross.android.views.PropertyFinderApplication;
import com.propertycross.android.views.PropertyView;
import com.propertycross.android.views.SearchResultsView;

public class NavigationService implements INavigationService {
	
	private PropertyFinderApplication application;

	public NavigationService(PropertyFinderApplication app)
	{
		application = app;
	}

	public void pushPresenter(Object presenter)
	{
		Object oldPresenter = application.presenter;
		if(presenter != oldPresenter)
		{
			application.presenter = presenter;
			Intent i = null;

			if(presenter instanceof SearchResultsPresenter)
			{
				i = new Intent(application.currentActivity, SearchResultsView.class);
			}
			else if(presenter instanceof PropertyPresenter)
			{
				i = new Intent(application.currentActivity, PropertyView.class);
			}
			else if(presenter instanceof FavouritesPresenter)
			{
				i = new Intent(application.currentActivity, FavouritesView.class);
			}

			if(i != null)
				application.currentActivity.startActivity(i);
		}
	}
}