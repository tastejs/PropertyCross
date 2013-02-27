package com.propertycross.mgwt.properties;

import com.google.gwt.safehtml.shared.SafeUri;

import static com.google.gwt.safehtml.shared.UriUtils.*;

public final class Property {

    private final String guid;
    private final String title;
    private final String price;
    private final String formattedPrice;
    private final String bedBathroomText;
    private final String bedrooms;
    private final String bathrooms;
    private final String type;
    private final SafeUri imgUrl;
    private final String summary;

    public Property(String guid, String title, String price, String bedrooms,
            String bathrooms, String type, String imgUrl, String summary)
    {
        this.guid = guid;
        this.title = title;
        this.price = price;
        formattedPrice = formatPrice(price);
        bedBathroomText = createBedBathroomText(bedrooms, bathrooms);
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.type = type;
        this.imgUrl = fromString(imgUrl);
        this.summary = summary;
    }

    

		public String id()
    {
        return guid;
    }

    public String type()
    {
        return type;
    }

    public String bathrooms()
    {
        return bathrooms;
    }

    public String bedrooms()
    {
        return bedrooms;
    }
    
    public String bedBathroomText()
    {
        return bedBathroomText;
    }

    public String summary()
    {
        return summary;
    }

    public SafeUri imgUrl()
    {
        return imgUrl;
    }

    public String price()
    {
        return price;
    }

    public String formattedPrice()
    {
        return formattedPrice;
    }

    private String formatPrice(String price)
    {
        String[] s = price.split(" ");
        return "£" + s[0];
    }
    
    private String createBedBathroomText(String bedrooms, String bathrooms) {
	    return bedrooms + " bed, " + bathrooms + " bathroom";
    }

    public String title()
    {
        return title;
    }

    @Override
    public int hashCode()
    {
        int hash = 3;
        hash = 83 * hash + (guid != null ? guid.hashCode() : 0);
        hash = 83 * hash + (title != null ? title.hashCode() : 0);
        hash = 83 * hash + (price != null ? price.hashCode() : 0);
        hash = 83 * hash + (bedrooms != null ? bedrooms.hashCode() : 0);
        hash = 83 * hash + (bathrooms != null ? bathrooms.hashCode() : 0);
        hash = 83 * hash + (type != null ? type.hashCode() : 0);
        hash = 83 * hash + (imgUrl != null ? imgUrl.hashCode() : 0);
        hash = 83 * hash + (summary != null ? summary.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj)
    {
        if(obj == null) return false;
        if(getClass() != obj.getClass()) return false;

        Property o = (Property)obj;
        if((guid == null) ? (o.guid != null) : !guid.equals(o.guid)) {
            return false;
        }
        if((title == null) ? (o.title != null) : !title.equals(o.title)) {
            return false;
        }
        if((price == null) ? (o.price != null) : !price.equals(o.price)) {
            return false;
        }
        if((bedrooms == null) ? (o.bedrooms != null)
                : !bedrooms.equals(o.bedrooms)) return false;
        if((bathrooms == null) ? (o.bathrooms != null)
                : !bathrooms.equals(o.bathrooms)) return false;
        if((type == null) ? (o.type != null) : !type.equals(o.type)) {
            return false;
        }
        if(imgUrl != o.imgUrl && (imgUrl == null || !imgUrl.equals(o.imgUrl))) {
            return false;
        }
        if((summary == null) ? (o.summary != null)
                : !summary.equals(o.summary)) return false;
        return true;
    }

    @Override
    public String toString()
    {
        return "Property{" + "guid=" + guid + ", title=" + title + ", price=" +
                price + ", bedrooms=" + bedrooms + ", bathrooms=" + bathrooms +
                ", type=" + type + ", imgUrl=" + imgUrl + ", summary=" +
                summary + '}';
    }

}
