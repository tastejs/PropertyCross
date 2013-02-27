package com.propertycross.mgwt.locations;

public final class Location {

    private final String displayName;
    private final String name;

    public Location(String displayName, String name)
    {
        this.displayName = displayName;
        this.name = name;
    }

    public String getDisplayName()
    {
        return displayName;
    }

    public String getName()
    {
        return name;
    }

    @Override
    public String toString()
    {
        return "Location{" + "longTitle=" + displayName + ", name=" + name + '}';
    }

}
