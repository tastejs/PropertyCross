using System;
using PropertyFinder.Model;

namespace PropertyFinder.ViewModel
{
  public class LocationSelectedEventArgs : EventArgs
  {
    public LocationSelectedEventArgs (Location location)
    {
      Location = location;
    }

    public Location Location { private set; get; }
  }

  public class RecentSearchSelectedEventArgs : EventArgs
  {
    public RecentSearchSelectedEventArgs (RecentSearch recentSearch)
    {
      RecentSearch = recentSearch;
    }

    public RecentSearch RecentSearch { get; private set; }
  }
}
