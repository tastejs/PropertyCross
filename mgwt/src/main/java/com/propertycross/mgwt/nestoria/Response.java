package com.propertycross.mgwt.nestoria;

import java.util.List;
import com.propertycross.mgwt.locations.Location;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;
import com.propertycross.mgwt.properties.Property;

public interface Response {

	void process(Callback callback);

	public enum Code {

		UNAMIBIGUOUS(100), BEST_GUESS(101), LARGE(110), AMBIGUOUS(200), MISSPELLED(202), UNKNOWN(201), COORDINATE_ERROR(210);

		public final int intVal;

		private Code(int intVal) {
			this.intVal = intVal;
		}

		public static Code valueOf(int code) {
			for (Code c : Code.values()) {
				if (code == c.intVal)
					return c;
			}
			throw new IllegalArgumentException("unknown code: " + code);
		}

	}
	
	public final class AmbiguousLocation implements Response {

		private final List<Location> locations;
		
		public AmbiguousLocation(List<Location> location) {
	    super();
	    this.locations = location;
    }

		public List<Location> getLocations() {
    	return locations;
    }

		@Override
    public void process(Callback callback) {
			callback.onNoLocation(locations);
    }		
	}

	public final class ListingsFound implements Response {

		public List<Property> getListings() {
			return listings;
		}

		public int getPage() {
			return page;
		}

		public int getTotalResults() {
			return totalResults;
		}

		public Location getLocation() {
			return location;
		}

		public int getTotalPages() {
    	return totalPages;
    }

		private final List<Property> listings;
		private final int page;
		private final int totalPages;
		private final int totalResults;
		private final Location location;

		public ListingsFound(List<Property> listings, Location location, int page, int totalResults, int totalPages) {
			this.listings = listings;
			this.location = location;
			this.page = page;
			this.totalResults = totalResults;
			this.totalPages = totalPages;
		}

		@Override
		public void process(Callback callback) {
			callback.onResultsFound(this);
		}

	}

	public final class NoLocation implements Response {

		private final List<Location> suggestions;

		public NoLocation(List<Location> suggestions) {
			this.suggestions = suggestions;
		}

		@Override
		public void process(Callback callback) {
			if (suggestions.isEmpty()) {
				callback.onNoLocation();
			} else {
				callback.onNoLocation(suggestions);
			}
		}

	}

}
