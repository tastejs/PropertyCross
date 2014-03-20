
using PropertyCross.Core.Domain.SearchItem;

namespace PropertyCross.Core.Domain.Model
{
  public class RecentSearch
  {
    public SearchItemBase Search { get; set; }

    public int ResultsCount { get; set; }

    public RecentSearch ()
    {
    }

    public RecentSearch(SearchItemBase searchItem, int resultsCount)
    {
      Search = searchItem;
      ResultsCount = resultsCount;
    }
  }
}
