package com.propertycross.mgwt.activity.searchitem;

import com.google.gwt.i18n.client.NumberFormat;
import com.propertycross.mgwt.locations.Search;
import com.propertycross.mgwt.nestoria.QueryBuilder;
import com.propertycross.mgwt.nestoria.RequestSender.Callback;

public class GeolocationSearchItem extends SearchItemBase {
	
	public static final String SEARCH_PREFIX = "geo:";

	private double latitude;
	
	private double longitude;
	
	private static NumberFormat DISPLAY_FORMAT = NumberFormat.getFormat("##.00");
	
	public GeolocationSearchItem(double latitude, double longitude) {
	  super(DISPLAY_FORMAT.format(latitude) + ", " + DISPLAY_FORMAT.format(longitude));
	  this.latitude = latitude;
	  this.longitude = longitude;
  }

	@Override
  public void doQuery(Callback c) {
		QueryBuilder q = new QueryBuilder(requestSender);
    q.setCentrePoint(latitude, longitude);
    q.setPage(getPageNumber());
    q.doQuery(c);
  }

	@Override
  public Search createPersistentSearch(int resultsCount) {
		String searchString = SEARCH_PREFIX + Double.toString(latitude) + "," + Double.toString(longitude);
	  return new Search(this.getDisplayText(), searchString, resultsCount);
  }

}
