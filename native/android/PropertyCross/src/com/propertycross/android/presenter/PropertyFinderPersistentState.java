package com.propertycross.android.presenter;

import java.util.ArrayList;
import java.util.List;

import com.propertycross.android.model.Property;

public class PropertyFinderPersistentState {

	private IStatePersistenceService service;
	private List<Property> favourites;
	private List<RecentSearch> recentSearches;
	
	public PropertyFinderPersistentState() {
		favourites = new ArrayList<Property>();
		recentSearches = new ArrayList<RecentSearch>();
	}
	
	public PropertyFinderPersistentState(IStatePersistenceService value) {
		favourites = new ArrayList<Property>();
		recentSearches = new ArrayList<RecentSearch>();
		service = value;
	}
	
	public void setPersistenceService(IStatePersistenceService value) {
		service = value;
	}
	
	public List<Property> getFavourites() {
		return favourites;
	}
	
	public void setFavourites(List<Property> value) {
		favourites = value;
	}
	
	public List<RecentSearch> getRecentSearches() {
	    return recentSearches;
	}
	
	public void setRecentSearches(List<RecentSearch> value) {
		recentSearches = value;
	}
	
	public void addSearchToRecent(RecentSearch search) {
		RecentSearch matchingSearch = getMatchingRecentSearchFor(search);
		if (matchingSearch != null) {
			recentSearches.remove(matchingSearch);
			((ArrayList<RecentSearch>)recentSearches).add(0, matchingSearch);
		}
		else {
			((ArrayList<RecentSearch>) recentSearches).add(0, search);
			if (recentSearches.size() > 4) {
				recentSearches.remove(recentSearches.size() - 1);
			}
		}
	}
	
	private RecentSearch getMatchingRecentSearchFor (RecentSearch s) {
		for (RecentSearch search : recentSearches) {
			if (search.getSearch().getDisplayText().equals(s.getSearch().getDisplayText())) {
				return search;
			}
		}
		return null;
	}
	
	public boolean isPropertyFavourited(Property p) {
		for(Property property : favourites) {
			if(p.getGuid() == property.getGuid()) {
				return true;
			}
		}		
		return false;
	}
	
	public void toggleFavourite(Property p) {
		
		if (isPropertyFavourited(p)) {
			favourites.remove(getMatchingPropertyFor(p));
		}
		else {
			favourites.add(p);
		}
		
		persistState();		
	}
	
	private Property getMatchingPropertyFor(Property p) {
		for (Property property : favourites) {
			if (p.getGuid() == property.getGuid()) {
				return property;
			}
		}
		
		return null;
	}
	
	private void persistState() {
		service.saveState(this);
	}
}