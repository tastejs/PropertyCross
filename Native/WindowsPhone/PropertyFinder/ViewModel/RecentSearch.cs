using System.Xml.Serialization;

namespace PropertyFinder.ViewModel
{
  public class RecentSearch
  {
    public SearchItemBase Search { get; set; }

    public int ResultsCount { get; set; }

    [XmlIgnore]
    public PropertyFinderViewModel Parent {get; set;}

    public RecentSearch ()
    {
    }

    public RecentSearch(SearchItemBase searchItem, int resultsCount, PropertyFinderViewModel parent)
    {
      Search = searchItem;
      ResultsCount = resultsCount;
      Parent = parent;
    }
  }
}
