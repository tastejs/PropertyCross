package com.propertycross.nestoria;

import static org.mockito.Mockito.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import com.propertycross.nestoria.RequestSender.Callback;

@RunWith(MockitoJUnitRunner.class)
public class QueryBuilderTest {

    private QueryBuilder query;
    @Mock private RequestSender sender;
    @Mock private Callback callback;

    @Before
    public void queryBuilder() throws Throwable
    {
        query = new QueryBuilder(sender);
    }

    @Test
    public void buildsUrlForCoords() throws Throwable
    {
        query.setPage(5);
        query.setCentrePoint(12.2, 54.9);

        query.doQuery(callback);

        String url = "http://api.nestoria.co.uk/api?country=uk&pretty=1" +
        		"&action=search_listings&encoding=json&listing_type=buy" +
        		"&page=5&centre_point=12.2,54.9";
        verify(sender).ping(url, callback);
    }

    @Test
    public void buildsUrlForPlace() throws Throwable
    {
        query.setPage(3);
        query.setPlaceName("thePlace");

        query.doQuery(callback);

        String url = "http://api.nestoria.co.uk/api?country=uk&pretty=1" +
        		"&action=search_listings&encoding=json&listing_type=buy" +
        		"&page=3&place_name=thePlace";
        verify(sender).ping(url, callback);
    }

}
