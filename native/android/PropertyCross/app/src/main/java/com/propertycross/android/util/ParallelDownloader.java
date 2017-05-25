package com.propertycross.android.util;

import android.annotation.TargetApi;
import android.os.AsyncTask;
import android.os.Build;

@TargetApi(Build.VERSION_CODES.HONEYCOMB)
public class ParallelDownloader {

    public static <P> void executeInParallel(AsyncTask<P, ?, ?> task, P... params) {
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, params);
    }
    
}
