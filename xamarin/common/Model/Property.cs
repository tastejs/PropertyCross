using System;
using Newtonsoft.Json.Linq;

namespace PropertyCross.Model
{
  public class Property
  {
    public Property()
    {
    }

    public Property(JToken jsonProperty)
    {
      Guid = (string)jsonProperty["guid"];
      Price = (int)jsonProperty["price"];
      PropertyType = (string)jsonProperty["property_type"];
      Bedrooms = (int)jsonProperty["bedroom_number"];
      Bathrooms = (int)jsonProperty["bathroom_number"];
      Title = (string)jsonProperty["title"];
      ThumbnailUrl = (string)jsonProperty["thumb_url"];
      ImageUrl = (string)jsonProperty["img_url"];
      Summary = (string)jsonProperty["summary"];
    } 

    public string Guid { get; set;}

    public string Summary { get; set; }

    public int Price { get; set; }

    public int? Bedrooms { get; set; }

    public int? Bathrooms { get; set; }

    public string PropertyType { get; set; }

    public string Title { get; set; }

    public string ThumbnailUrl { get; set; }

    public string ImageUrl { get; set; }

    public string BedBathroomText
    {
      get
      {
        return string.Format("{0:d} bed, {1:d} bathroom", Bedrooms, Bathrooms);
      }
    }
    public string FormattedPrice
    {
      get
      {
        return string.Format("£{0:0,0}", Price);
      }
    }

    public string ShortTitle
    {
      get
      {
        var titleParts = Title.Split(',');
        if (titleParts.Length >= 2)
        {
          return titleParts[0] + ", " + titleParts[1];
        }
        return Title;
      }
    }
  }
}
