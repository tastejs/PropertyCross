package com.propertycross.android.util;

import java.lang.ref.WeakReference;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;

public class AsyncDrawable extends BitmapDrawable {

	private WeakReference<DownloadImageTask> taskRef;
	
	public AsyncDrawable(Resources resources, Bitmap bitmap, DownloadImageTask task) {
		super(resources, bitmap);
		taskRef = new WeakReference<DownloadImageTask>(task);
	}
	
	public DownloadImageTask getTask() {
		return taskRef.get();
	}
	
}
