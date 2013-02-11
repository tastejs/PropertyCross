package com.propertycross.mgwt.locations;

import java.util.List;

public interface SearchesManager {

    List<Search> recentSearches();
    void add(String location, int totalResults);

}
