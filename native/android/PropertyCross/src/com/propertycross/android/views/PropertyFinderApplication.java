package com.propertycross.android.views;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

public class PropertyFinderApplication extends Application {

	public Activity currentActivity;
	public Object presenter;
	
	public static PropertyFinderApplication getApplication(Context context) {
	    return (PropertyFinderApplication) context.getApplicationContext();
	}
}
