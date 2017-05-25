package com.propertycross.android.views;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Environment;

import uk.co.senab.bitmapcache.BitmapLruCache;

import java.io.File;

public class PropertyFinderApplication extends Application {

	public Activity currentActivity;
	public Object presenter;
	public BitmapLruCache cache;
	
	@Override public void onCreate() {
	    super.onCreate();
	    
	    File cacheLoc = new File(Environment.getExternalStorageDirectory() + "/PropertyCross");
	    cacheLoc.mkdirs();
	    
	    BitmapLruCache.Builder builder = new BitmapLruCache.Builder();
	    builder.setMemoryCacheEnabled(true);
	    builder.setMemoryCacheMaxSizeUsingHeapSize();
	    builder.setDiskCacheEnabled(true);
	    builder.setDiskCacheLocation(cacheLoc);
	    
	    cache = builder.build();
	}
	
	public static PropertyFinderApplication getApplication(Context context) {
	    return (PropertyFinderApplication) context.getApplicationContext();
	}
}
