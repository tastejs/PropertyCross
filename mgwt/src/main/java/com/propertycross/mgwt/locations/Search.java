package com.propertycross.mgwt.locations;

public final class Search {

    private final String location;
    private final int numberProperties;

    public Search(String location, int numberProperties)
    {
        this.location = location;
        this.numberProperties = numberProperties;
    }

    public String location()
    {
        return location;
    }

    public int numberProperties()
    {
        return numberProperties;
    }

    @Override
    public int hashCode()
    {
        int hash = 7;
        hash = 97 * hash + (location != null ? location.hashCode() : 0);
        hash = 97 * hash + numberProperties;
        return hash;
    }

    @Override
    public boolean equals(Object obj)
    {
        if(obj == null) return false;
        if(getClass() != obj.getClass()) return false;

        Search o = (Search)obj;
        if((location == null) ? (o.location != null)
                : !location.equals(o.location)) return false;
        if(numberProperties != o.numberProperties) return false;
        return true;
    }

    @Override
    public String toString()
    {
        return "Search{" + "location=" + location + ", numberProperties=" +
                numberProperties + '}';
    }

}
