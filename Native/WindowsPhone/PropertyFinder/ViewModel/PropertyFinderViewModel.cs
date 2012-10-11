using System;
using System.Linq;
using System.Collections.Generic;
using PropertyFinder.Model;
using System.Windows.Input;

namespace PropertyFinder.ViewModel
{
  /// <summary>
  /// A view model for the front-page of this application This view model allows the
  /// user to search by a text string or their current location.
  /// </summary>
  public class PropertyFinderViewModel : ViewModelBase
  {
    private PropertyDataSource _propertyDataSource;

    private INavigationService _navigationService;

    private PropertyFinderPersistentState _state;

    private IGeoLocationService _geolocationService;

    private SearchItemBase _searchItem = new PlainTextSearchItem("");

    private string _userMessage;

    private List<RecentSearch> _recentSearches = new List<RecentSearch>();

    private List<LocationViewModel> _locations = new List<LocationViewModel>();

    private bool _isLoading;

    private string _searchText;

    public PropertyFinderViewModel(PropertyFinderPersistentState state,
      PropertyDataSource dataSource, INavigationService navigationService, IGeoLocationService geolocationService)
    {
      _propertyDataSource = dataSource;
      _navigationService = navigationService;
      _state = state;
      _geolocationService = geolocationService;
      _recentSearches = state.RecentSearches;

      foreach (var search in _recentSearches)
      {
        search.Parent = this;
      }
    }

    public string UserMessage
    {
      get { return _userMessage; }
      set
      {
        SetField<string>(ref _userMessage, value, "UserMessage");
      }
    }

    public bool IsLoading
    {
      get { return _isLoading; }
      set
      {
        SetField<bool>(ref _isLoading, value, "IsLoading");
      }
    }

    public string SearchText
    {
      get { return _searchText; }
      set
      {
        SetSearchText(value);
      }
    }

    private void SetSearchText(string value, bool internalCall = false)
    {
      SetField<string>(ref _searchText, value, "SearchText", () =>
          {
            if (!internalCall)
            {
              _searchItem = new PlainTextSearchItem(_searchText);
            }
          });
    }

    public List<RecentSearch> RecentSearches
    {
      get { return _recentSearches; }
      set
      {
        SetField<List<RecentSearch>>(ref _recentSearches, value, "RecentSearches");
      }
    }

    public List<LocationViewModel> Locations
    {
      get { return _locations; }
      set
      {
        SetField<List<LocationViewModel>>(ref _locations, value, "Locations");
      }
    }

    public ICommand SearchCommand
    {
      get
      {
        return new DelegateCommand(() => SearchForProperties());
      }
    }

    public ICommand RecentSearchSelectedCommand
    {
      get
      {
        return new DelegateCommand<RecentSearch>(recentSearch => RecentSearchSelected(recentSearch));
      }
    }

    public ICommand LocationSelectedCommand
    {
      get
      {
        return new DelegateCommand<Location>(location => LocationSelected(location));
      }
    }

    public ICommand FavouritesSelectedCommand
    {
      get
      {
        return new DelegateCommand(() => FavouritesSelected());
      }
    }

    public ICommand SearchMyLocationCommand
    {
      get
      {
        return new DelegateCommand(() => SearchMyLocation());
      }
    }

    private void SearchMyLocation()
    {
      IsLoading = true;
      _geolocationService.GetLocation(location =>
        {
          IsLoading = false;

          _searchItem = new GeoLocationSearchItem(new GeoLocation()
          {
            Latitude = location.Latitude,
            Longitude = location.Longitude
          });
          SetSearchText(_searchItem.DisplayText, true);
          SearchForProperties();
        });
    }

    private void FavouritesSelected()
    {
      var viewModel = new FavouritesViewModel(_navigationService, _state);
      _navigationService.PushViewModel(viewModel);
    }
    
    private void RecentSearchSelected(RecentSearch recentSearch)
    {
      _searchItem = recentSearch.Search;
      SetSearchText(_searchItem.DisplayText, true);
      SearchForProperties();
    }

    private void LocationSelected(Location location)
    {
      _searchItem = new PlainTextSearchItem(location.Name, location.DisplayName);
      SetSearchText(_searchItem.DisplayText, true);
      SearchForProperties();
    }

    private void SearchForProperties()
    {
      Locations = new List<LocationViewModel>();
      IsLoading = true;
      UserMessage = null;

      _searchItem.FindProperties(_propertyDataSource, 1, response =>
      {
        if (response is PropertyListingsResult)
        {
          var propertiesResponse = (PropertyListingsResult)response;
          if (propertiesResponse.Data.Count == 0)
          {
            UserMessage = "There were no properties found for the given location.";
          }
          else
          {
            var listingsResponse = (PropertyListingsResult)response;
            _state.AddSearchToRecent(new RecentSearch(_searchItem, listingsResponse.TotalResult, this));
            RecentSearches = _state.RecentSearches.ToList();
            var presenter = new SearchResultsViewModel(_navigationService, _state, listingsResponse,
                                                        _searchItem, _propertyDataSource);
            _navigationService.PushViewModel(presenter);
          }
        }
        else if (response is PropertyLocationsResult)
        {
          RecentSearches = new List<RecentSearch>(); // TODO - this is yucky!
          Locations = ((PropertyLocationsResult)response).Data
                                      .Select(location => new LocationViewModel(this, location))
                                      .ToList();
        }
        else
        {
          UserMessage = "The location given was not recognised.";
        }

        IsLoading = false;
      }, error =>
      {
        UserMessage = "An error occurred while searching. Please check your network connection and try again.";
        IsLoading = false;
      });
    }
  }
}
