package com.propertycross.android.util;

import java.lang.ref.WeakReference;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.widget.ImageView;

public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {

	private WeakReference<ImageView> imageRef;
	private String url;
	
	public DownloadImageTask(ImageView image) {
		imageRef = new WeakReference<ImageView>(image);
		url = "";
	}
	
	public String getUrl() {
		return url;
	}

	@Override
	protected Bitmap doInBackground(String... args) {
		url = args[0];
		Bitmap bitmap = null;
		try {
			HttpClient c = new DefaultHttpClient();
			HttpGet g = new HttpGet(url);
			HttpResponse r = c.execute(g);
			
			bitmap = BitmapFactory.decodeStream(r.getEntity().getContent());			
		}
		catch(Exception e) {
			
		}
		
		return bitmap;
	}
	
	@Override
	protected void onPostExecute(Bitmap result) {
		Bitmap bitmap = result;
		
		if (isCancelled()) {
			bitmap = null;
		}
		if (imageRef != null && bitmap != null) {
			ImageView image = imageRef.get();
			DownloadImageTask task = BitmapUtils.getTask(image);
			
			if (this == task && image != null) {
				image.setImageBitmap(bitmap);
			}
		}
	}	
}
