package com.propertycross.android.presenter;

import com.propertycross.android.events.Callback;

public interface IMarshalInvokeService {
	 void invoke(final Callback<Void> action);
}
