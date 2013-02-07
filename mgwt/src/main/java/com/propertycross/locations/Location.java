package com.propertycross.locations;


public final class Location {

    private final String longTitle;
    private final String name;

    public Location(String longTitle, String name)
    {
        this.longTitle = longTitle;
        this.name = name;
    }

    public String longTitle()
    {
        return longTitle;
    }

    public String name()
    {
        return name;
    }

    @Override
    public int hashCode()
    {
        int hash = 7;
        hash = 29 * hash + (longTitle != null ? longTitle.hashCode() : 0);
        hash = 29 * hash + (name != null ? name.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj)
    {
        if(obj == null) return false;
        if(getClass() != obj.getClass()) return false;

        Location o = (Location)obj;
        if((o.longTitle == null) ? (o.longTitle != null)
                : !longTitle.equals(o.longTitle)) return false;
        if((name == null) ? (o.name != null) : !name.equals(o.name)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString()
    {
        return "Location{" + "longTitle=" + longTitle + ", name=" + name + '}';
    }

}
