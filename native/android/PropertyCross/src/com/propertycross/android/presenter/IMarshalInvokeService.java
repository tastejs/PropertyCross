package com.propertycross.android.presenter;

import com.propertycross.android.events.Callback;

public interface IMarshalInvokeService {
	 void Invoke(final Callback<Void> action);
}
