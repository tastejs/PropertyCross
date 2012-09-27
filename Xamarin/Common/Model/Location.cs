
using Newtonsoft.Json.Linq;

namespace PropertyFinder.Model
{
  public class Location
  {
    public Location(JToken jsonLocation)
    {
      DisplayName = (string)jsonLocation["long_title"];
      Name = (string)jsonLocation["place_name"];
    }

    public Location(string location)
    {
      DisplayName = location;
      Name = location;
    }

    public string DisplayName { private set; get; }

    public string Name { private set; get; }
  }
}
