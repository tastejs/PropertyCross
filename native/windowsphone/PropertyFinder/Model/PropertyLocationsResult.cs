using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PropertyFinder.Model
{
  public class PropertyLocationsResult : PropertyDataSourceResult
  {
    public PropertyLocationsResult(JObject json)
    {
      Data = new List<Location>();

      JArray listings = (JArray)json["response"]["locations"];
      foreach (var listing in listings)
      {
        Data.Add(new Location(listing));
      }
    }

    public List<Location> Data { get; private set; }
  }
}
