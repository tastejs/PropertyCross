package com.propertycross.android.presenter;

public interface IStatePersistenceService {

	void saveState(PropertyFinderPersistentState state);
	PropertyFinderPersistentState loadState();
}
