
package com.propertycross.android.util;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.util.AttributeSet;
import android.util.DisplayMetrics;

import com.propertycross.android.views.PropertyFinderApplication;

import uk.co.senab.bitmapcache.BitmapLruCache;
import uk.co.senab.bitmapcache.CacheableImageView;

public class NetworkedCacheableImageView extends CacheableImageView {

    private BitmapLruCache cache;
    private DownloadImageTask currentTask;

    public NetworkedCacheableImageView(Context context, AttributeSet attrs) {
        super(context, attrs);
        if(!isInEditMode())
            cache = PropertyFinderApplication.getApplication(context).cache;
    }

    public boolean loadImage(String url, final boolean fullSize) {
        
        // Cancel a task that is currently running.
        if (currentTask != null) {
            currentTask.cancel(false);
        }
        
        BitmapDrawable wrapper = cache.getFromMemoryCache(url);
        if (wrapper != null) {
            setImageDrawable(wrapper);
            return true;
        }
        else {
            setImageDrawable(null);

            BitmapFactory.Options decodeOptions = null;

            if (!fullSize) {
                decodeOptions = new BitmapFactory.Options();
                decodeOptions.inDensity = DisplayMetrics.DENSITY_HIGH;
            }

            currentTask = new DownloadImageTask(this, cache, decodeOptions);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
                ParallelDownloader.executeInParallel(currentTask, url);
            } else {
                currentTask.execute(url);
            }

            return false;
        }
    }

}
