package com.propertycross.locations;

import java.util.List;


public interface SearchesManager {
    
    List<Search> recentSearches();
    void add(String location, int totalResults);

}
