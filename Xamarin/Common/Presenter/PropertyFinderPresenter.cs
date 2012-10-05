using System;
using System.Collections.Generic;
using PropertyFinder.Model;

namespace PropertyFinder.Presenter
{
  /// <summary>
  /// A presenter for the front-page of this application This presenter allows the
  /// user to search by a text string or their current location.
  /// </summary>
  public class PropertyFinderPresenter
  {
    /// <summary>
    /// The interface this presenter requires from the assocaited view.
    /// </summary>
    public interface View
    {
      /// <summary>
      /// Sets the text displayed in the search field.
      /// </summary>
      string SearchText { set; }

      /// <summary>
      /// Supplies a message to the user, typically to indicate an error or problem.
      /// </summary>
      void SetMessage(string message);

      /// <summary>
      /// Displays a list of suggested locations when the user supplies a plain-text search.
      /// </summary>
      void DisplaySuggestedLocations(List<Location> locations);

      /// <summary>
      /// Displays a list of recently performed searches
      /// </summary>
      void DisplayRecentSearches(List<RecentSearch> recentSearches);

      /// <summary>
      /// Sets whether to display a loading indicator
      /// </summary>
      bool IsLoading { set; }

      event EventHandler SearchButtonClicked;

      event EventHandler<SearchTextChangedEventArgs> SearchTextChanged;

      event EventHandler MyLocationButtonClicked;

      event EventHandler FavouritesClicked;

      event EventHandler<LocationSelectedEventArgs> LocationSelected;

      event EventHandler<RecentSearchSelectedEventArgs> RecentSearchSelected;
    }

    private View _view;

    private PropertyDataSource _propertyDataSource;

    private INavigationService _navigationService;

    private PropertyFinderPersistentState _state;

    private IGeoLocationService _geolocationService;

    private SearchItemBase _searchItem = new PlainTextSearchItem("");

    public PropertyFinderPresenter(PropertyFinderPersistentState state,
      PropertyDataSource dataSource, INavigationService navigationService, IGeoLocationService geolocationService)
    {
      _propertyDataSource = dataSource;
      _navigationService = navigationService;
      _state = state;
      _geolocationService = geolocationService;
    }

    public void SetView(View view)
    {
      _view = view;
      _view.SearchButtonClicked += View_SearchButtonClicked;
      _view.LocationSelected += View_LocationSelected;
      _view.FavouritesClicked += View_FavouritesClicked;
      _view.MyLocationButtonClicked += View_MyLocationButtonClicked;
      _view.SearchTextChanged += View_SearchTextChanged;
      _view.RecentSearchSelected += View_RecentSearchSelected;

      _view.DisplayRecentSearches(_state.RecentSearches);
    }

    private void View_RecentSearchSelected (object sender, RecentSearchSelectedEventArgs e)
    {
      _searchItem = e.RecentSearch.Search;
      _view.SearchText = e.RecentSearch.Search.DisplayText;
      SearchForProperties();
    }
    
    private void View_SearchTextChanged(object sender, SearchTextChangedEventArgs e)
    {
      if (e.Text != _searchItem.DisplayText)
      {
        _searchItem = new PlainTextSearchItem(e.Text);
      }
    }

    private void View_MyLocationButtonClicked(object sender, EventArgs e)
    {
      _view.IsLoading = true;
      _geolocationService.GetLocation(location =>
        {
          _searchItem = new GeoLocationSearchItem(location);
          _view.SearchText = _searchItem.DisplayText;
          _view.IsLoading = false;

          SearchForProperties();
        });
    }

    private void View_FavouritesClicked(object sender, EventArgs e)
    {
      var presenter = new FavouritesPresenter(_navigationService, _state);
      _navigationService.PushPresenter(presenter);
    }

    private void View_LocationSelected(object sender, LocationSelectedEventArgs e)
    {
      _view.SearchText = e.Location.DisplayName;
      _view.DisplaySuggestedLocations(null);
      _searchItem = new PlainTextSearchItem(e.Location.Name, e.Location.DisplayName);
      SearchForProperties();
    }

    private void View_SearchButtonClicked(object sender, EventArgs e)
    {
      SearchForProperties();
    }

    private void SearchForProperties()
    {
      _view.IsLoading = true;

      _view.SetMessage(null);

      _searchItem.FindProperties(_propertyDataSource, 1, response =>
      {
        if (response is PropertyListingsResult)
        {
          var propertiesResponse = (PropertyListingsResult)response;
          if (propertiesResponse.Data.Count == 0)
          {
            _view.SetMessage("There were no properties found for the given location.");
          }
          else
          {
            var listingsResponse = (PropertyListingsResult)response;
            _state.AddSearchToRecent(new RecentSearch(_searchItem, listingsResponse.TotalResult));
            _view.DisplayRecentSearches(_state.RecentSearches);
            var presenter = new SearchResultsPresenter(_navigationService, _state, listingsResponse,
                                                        _searchItem, _propertyDataSource);
            _navigationService.PushPresenter(presenter);
          }
        }
        else if (response is PropertyLocationsResult)
        {
          _view.DisplayRecentSearches(null);
          _view.DisplaySuggestedLocations(((PropertyLocationsResult)response).Data);
        }
        else
        {
          _view.SetMessage("The location given was not recognised.");
        }

        _view.IsLoading = false;
      });
    }
  }
}
