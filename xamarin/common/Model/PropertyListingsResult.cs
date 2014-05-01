using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace PropertyCross.Model
{
  /// <summary>
  /// The results of a property search. This might contain a lst of properties, an error response, or 
  /// a collection of locat
  /// </summary>
  public class PropertyListingsResult : PropertyDataSourceResult
  {
    public PropertyListingsResult(JObject json)
    { 
      TotalResult = (int)json["response"]["total_results"];
      PageNumber = int.Parse((string)json["response"]["page"]);
      TotalPages = (int)json["response"]["total_pages"];

      Data = new List<Property>();

      JArray listings = (JArray)json["response"]["listings"];
      foreach (var listing in listings)
      {
        Data.Add(new Property(listing));
      }
    }

    public int TotalResult { get; private set; }

    public int PageNumber { get; private set; }

    public int TotalPages { get; private set; }

    public List<Property> Data { get; private set; }
  }

}
