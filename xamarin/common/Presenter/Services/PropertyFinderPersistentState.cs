using System.Collections.Generic;
using PropertyFinder.Model;
using System.Linq;
using System.Xml.Serialization;
using System.IO;
using System.Diagnostics;
using System.Runtime.Serialization;

namespace PropertyFinder.Presenter
{
  /// <summary>
  /// This class hold all the application state that should be persisted
  /// between sessions. When the state changes, this class persists itself via
  /// the supplied <see cref="IStatePersistenceService"/> instance.
  /// </summary>
  [XmlInclude(typeof(PlainTextSearchItem))]
  [XmlInclude(typeof(GeoLocationSearchItem))]
  public class PropertyFinderPersistentState
  {
    private IStatePersistenceService _persistenceService;

    public IStatePersistenceService PersistenceService
    {
      set { _persistenceService = value; }
    }

    public PropertyFinderPersistentState()
    {
      Favourites = new List<Property>();
      RecentSearches = new List<RecentSearch>();
    }

    public PropertyFinderPersistentState(IStatePersistenceService persistenceService)
      : this()
    {
      _persistenceService = persistenceService;
    }

    /// <summary>
    /// Gets or sets the properties the user has marked as favourites
    /// </summary>
    public List<Property> Favourites { get; set; }

    /// <summary>
    /// Gets or sets a few recent searches
    /// </summary>
    public List<RecentSearch> RecentSearches { get; set; }

    /// <summary>
    /// Adds the given search to the RecentSearches list. 
    /// </summary>
    public void AddSearchToRecent (RecentSearch search)
    {
      // if we already have this search saved, move it to the top
      if (RecentSearches.Any (r => r.Search.DisplayText == search.Search.DisplayText))
      {
        var matchingSearch = RecentSearches.Single (r => r.Search.DisplayText == search.Search.DisplayText);
        RecentSearches.Remove (matchingSearch);
        RecentSearches.Insert (0, matchingSearch);
      }
      else
      {
        // otherwise, add it
        RecentSearches.Insert (0, search);
        if (RecentSearches.Count > 4)
        {
          RecentSearches.RemoveAt (RecentSearches.Count - 1);
        }
      }
      _persistenceService.SaveState(this);
    }

    /// <summary>
    /// Gets whether the given property is favourited
    /// </summary>
    public bool IsPropertyFavourited(Property property)
    {
      return Favourites.Any(p => p.Guid == property.Guid);
    }

    /// <summary>
    /// Toggles the favourited state of the given property.
    /// </summary>
    public void ToggleFavourite(Property property)
    {
      if (IsPropertyFavourited(property))
      {
        var matchingProperty = Favourites.Single(p => p.Guid == property.Guid);
        Favourites.Remove(matchingProperty);
      }
      else
      {
        Favourites.Add(property);
      }

      PersistState();
    }

    /// <summary>
    /// Persists the current state.
    /// </summary>
    private void PersistState()
    {
      _persistenceService.SaveState(this);
    }
  }
}
