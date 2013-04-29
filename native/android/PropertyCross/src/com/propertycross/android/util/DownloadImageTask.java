package com.propertycross.android.util;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;

import uk.co.senab.bitmapcache.BitmapLruCache;
import uk.co.senab.bitmapcache.CacheableBitmapDrawable;

import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;

public class DownloadImageTask extends AsyncTask<String, Void, CacheableBitmapDrawable> {

    private static final String TAG = "DownloadImageTask";
    private final BitmapLruCache cache;
    private final WeakReference<ImageView> imageRef;
    private final BitmapFactory.Options decodeOptions;

    DownloadImageTask(ImageView imageView, BitmapLruCache cache, BitmapFactory.Options decodeOpts) {
        this.cache = cache;
        imageRef = new WeakReference<ImageView>(imageView);
        decodeOptions = decodeOpts;
    }

    @Override
    protected CacheableBitmapDrawable doInBackground(String... params) {
        try {
            if (imageRef.get() == null) {
                return null;
            }

            final String url = params[0];
            CacheableBitmapDrawable result = cache.get(url, decodeOptions);

            if (result == null) {
                Log.d(TAG, "Downloading image from: " + url);

                HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
                InputStream is = new BufferedInputStream(conn.getInputStream());
                result = cache.put(url, is, decodeOptions);
            } else {
                Log.d(TAG, "Got from Cache: " + url);
            }

            return result;

        } catch (IOException e) {
            Log.e(TAG, e.toString());
        }

        return null;
    }

    @Override
    protected void onPostExecute(CacheableBitmapDrawable result) {
        super.onPostExecute(result);

        ImageView iv = imageRef.get();
        if (iv != null) {
            iv.setImageDrawable(result);
        }
    }
}
