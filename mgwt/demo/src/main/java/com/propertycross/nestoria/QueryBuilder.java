package com.propertycross.nestoria;

import com.propertycross.nestoria.RequestSender.Callback;


public final class QueryBuilder {
    
    private static final String BASE_URL = "http://api.nestoria.co.uk/api?" +
            "country=uk&pretty=1&action=search_listings" +
            "&encoding=json&listing_type=buy";

    private final RequestSender requestSender;
    
    private String placeName;
    private String centrePoint;
    private int page = 1;
    
    public QueryBuilder(RequestSender requestSender)
    {
        this.requestSender = requestSender;
    }
    
    public void setPlaceName(String placeName)
    {
        this.placeName = placeName;
    }
    
    public void setCentrePoint(double latitude, double longitude)
    {
        centrePoint = latitude + "," + longitude;
    }
    
    public void setPage(int page)
    {
        this.page = page;
    }
    
    private String url()
    {
        String url = BASE_URL;
        url += "&page=" + page;
        if(placeName != null) url += "&place_name=" + placeName;
        if(centrePoint != null) url += "&centre_point=" + centrePoint;
        return url;
    }
    
    public void doQuery(final Callback c)
    {
        requestSender.ping(url(), c);
    }
    
}
