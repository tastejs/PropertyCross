
namespace PropertyFinder.Presenter
{
  public class RecentSearch
  {
    public SearchItemBase Search { get; private set; }

    public int ResultsCount { get; private set; }

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
