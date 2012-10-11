
using Newtonsoft.Json.Linq;
using System.Xml.Serialization;
using PropertyFinder.Presenter;

namespace PropertyFinder.Model
{
  public class Location
  {
    // TODO - should be in the view model layer!
    [XmlIgnore]
    public PropertyFinderViewModel Parent { get; set; }

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
