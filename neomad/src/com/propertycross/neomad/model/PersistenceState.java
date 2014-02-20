package com.propertycross.neomad.model;

import java.util.Vector;

import com.propertycross.neomad.event.Event;
import com.propertycross.neomad.model.search.RecentSearch;
import com.propertycross.neomad.service.impl.PersistenceService;

/**
 * @author Neomades
 */
public class PersistenceState {

	private static final int SEARCH_COUNT_LIMIT = 4;
	private Vector searches = new Vector();
	private Vector favorites = new Vector();
	private PersistenceService manager;

	public PersistenceState(PersistenceService manager) {
		this.manager = manager;
	}

	public Vector getSearches() {
		return searches;
	}

	public void setSearches(Vector searches) {
		this.searches = searches;
	}

	public void setFavourites(Vector favorites) {
		this.favorites = favorites;
	}

	public Vector getFavourites() {
		return favorites;
	}

	public boolean isFavorite(Property p) {
		for (int i = 0; i < favorites.size(); i++) {
			Property o = (Property) favorites.elementAt(i);
			if (o.getGuid().equals(p.getGuid())) {
				return true;
			}
		}
		return false;
	}

	public void persist(RecentSearch s) {
		RecentSearch rs = findByLabel(s.getSearch().getLabel());
		if (rs != null) {
			searches.removeElement(rs);
			rs.setCount(rs.getCount());
			if (rs.getCount() > 0) {
				searches.insertElementAt(rs, 0);
			}
		} else {
			if (s.getCount() > 0) {
				searches.insertElementAt(s, 0);
			}
		}
		if (searches.size() > SEARCH_COUNT_LIMIT) {
			searches.removeElementAt(SEARCH_COUNT_LIMIT);
		}
	}

	public void persist(Property p) {
		boolean f = false;
		for (int i = 0; i < favorites.size(); i++) {
			Property o = (Property) favorites.elementAt(i);
			if (o.getGuid().equals(p.getGuid())) {
				favorites.removeElementAt(i);
				f = true;
				break;
			}
		}
		if (!f) {
			favorites.addElement(p);
		}
	}

	private RecentSearch findByLabel(String label) {
		for (int i = 0; i < searches.size(); i++) {
			RecentSearch rs = (RecentSearch) searches.elementAt(i);
			if (label.equals(rs.getSearch().getLabel())) {
				return rs;
			}
		}
		return null;
	}

	public void flush() {
		manager.receive(new Event(null, null, null, Event.Type.SAVE));
	}
}
