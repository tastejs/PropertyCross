package com.propertycross.android.util;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.widget.ImageView;

public class BitmapUtils {

	public static void download(String url, ImageView imageView, Resources resources, Bitmap placeholder) {
		if (cancelPotentialDownload(url, imageView)) {
			DownloadImageTask task = new DownloadImageTask(imageView);
			AsyncDrawable drawable = new AsyncDrawable(resources, placeholder, task);
			imageView.setImageDrawable(drawable);
			task.execute(url);
		}
	}
	
	private static boolean cancelPotentialDownload(String url, ImageView imageView) {
		DownloadImageTask task = getTask(imageView);
		if (task != null) {
			String bitmapData = task.getUrl();
			
			if(bitmapData == null) {
				Log.d("PropertyCross", "Bitmap data url is null");
			}
			
			if (url == null) {
				Log.d("PropertyCross", "Url is null");
			}
			
			if (!bitmapData.equals(url)) {
				task.cancel(true);
			}
			else {
				return false;
			}
		}
		return true;
	}
	
	public static DownloadImageTask getTask(ImageView imageView) {
		if (imageView != null) {
			Drawable drawable = imageView.getDrawable();
			if (drawable instanceof AsyncDrawable) {
				return ((AsyncDrawable) drawable).getTask();
			}
		}
		return null;
	}
}
