package com.propertycross.android.services;

import com.propertycross.android.events.Callback;
import com.propertycross.android.presenter.IMarshalInvokeService;
import com.propertycross.android.views.PropertyFinderApplication;

public class MarshalInvokeService implements IMarshalInvokeService {

	private PropertyFinderApplication application;

	public MarshalInvokeService(PropertyFinderApplication application)
	{
		this.application = application;
	}

	public void invoke(final Callback<Void> action)
	{
		application.currentActivity.runOnUiThread(new Runnable() {

			@Override
			public void run() {
				action.complete(null);
			}
			
		});
	}
	
}
