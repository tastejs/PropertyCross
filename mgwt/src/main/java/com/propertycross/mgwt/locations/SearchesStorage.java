package com.propertycross.mgwt.locations;

import java.util.Queue;

interface SearchesStorage {

    void save(Queue<Search> rs);
    Queue<Search> load();
    void clear();

}
