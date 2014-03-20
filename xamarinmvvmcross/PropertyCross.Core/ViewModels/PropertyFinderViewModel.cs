using System.Collections.ObjectModel;
using System.Windows.Input;
using Cirrious.MvvmCross.Plugins.Location;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.Domain.Model;
using PropertyCross.Core.Domain.SearchItem;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.ViewModels
{
    public class PropertyFinderViewModel 
		: ViewModelBase
    {
        private readonly PropertyFinderPersistentState _state;
        private readonly PropertyDataSource _dataSource;        
        private readonly IGeoLocationService _geolocationService;

        public PropertyFinderViewModel(PropertyFinderPersistentState stateFactory,
      PropertyDataSource dataSource, IGeoLocationService geolocationService)
        {
            _state = stateFactory;            
            _dataSource = dataSource;
            _geolocationService = geolocationService;
            SearchCommand = new MvxCommand(DoSearch);
            UseLocationCommand = new MvxCommand(DoUseLocation);
            ShowFavouritesCommand = new MvxCommand(DoShowFavourites);
            RecentSearchSelectedCommand = new MvxCommand<RecentSearch>(DoRecentSearchSelected);
            LocationSelectedCommand = new MvxCommand<Location>(DoLocationSelected);
            SuggestedLocations = new ObservableCollection<Location>();
            RecentSearches = new ObservableCollection<RecentSearch>();

            LoadRecentSearches();
        }

        private void LoadRecentSearches()
        {
            RecentSearches.Clear();
            foreach (var listing in _state.RecentSearches)
            {
                RecentSearches.Add(listing);
            }
            
        }
        private SearchItemBase _searchItem = new PlainTextSearchItem("");

       

       

        private string _searchText = "";
        public string SearchText
		{
            get { return _searchText; }
            set
            {
                _searchText = value; RaisePropertyChanged(() => SearchText);
                if (value != _searchItem.DisplayText)
                {
                    _searchItem = new PlainTextSearchItem(value);
                }
            }
		}

        private string _message = "";

        public string Message
        {
            get { return _message; }
            set { _message = value; RaisePropertyChanged(() => Message); }
        }

        private bool _showSelectLocation;

        public bool ShowSelectLocation
        {
            get { return _showSelectLocation; }
            set { _showSelectLocation = value; RaisePropertyChanged(() => ShowSelectLocation); }
        }

        public ObservableCollection<RecentSearch> RecentSearches { get; set; }
        public ObservableCollection<Location> SuggestedLocations { get; set; }


        public ICommand SearchCommand { get; private set; }
        private void DoSearch()
        {
            SearchForProperties();
        }

        public ICommand UseLocationCommand { get; private set; }
        private void DoUseLocation()
        {
            IsBusy = true;
            _geolocationService.GetLocation(location =>
            {
                IsBusy = false;

                if (location == null)
                {
                    Message = "Unable to detect current location. Please ensure location is turned on in your phone settings and try again.";
                }
                else
                {
                    _searchItem = new GeoLocationSearchItem(location);
                    SearchText = _searchItem.DisplayText;
                    SearchForProperties();
                }
            });
        }

        public ICommand ShowFavouritesCommand { get; private set; }
        private void DoShowFavourites()
        {
            ShowViewModel<FavouritesViewModel>();
        }

        public ICommand RecentSearchSelectedCommand { get; private set; }
        private void DoRecentSearchSelected(RecentSearch recentSearch)
        {
            _searchItem = recentSearch.Search;
            SearchText =recentSearch.Search.DisplayText;
            SearchForProperties();
        }

        public ICommand LocationSelectedCommand { get; private set; }
        private void DoLocationSelected(Location location)
        {
            SearchText = location.DisplayName;
            SuggestedLocations.Clear();
            _searchItem = new PlainTextSearchItem(location.Name, location.DisplayName);
            SearchForProperties();
        }
        private void SearchForProperties()
        {
            IsBusy = true;
            Message = string.Empty;

            _searchItem.FindProperties(_dataSource, 1, response =>
            {
                if (response is PropertyListingsResult)
                {
                    var propertiesResponse = (PropertyListingsResult)response;
                    if (propertiesResponse.Data.Count == 0)
                    {
                       Message="There were no properties found for the given location.";
                    }
                    else
                    {
                        var listingsResponse = (PropertyListingsResult)response;
                        _state.AddSearchToRecent(new RecentSearch(_searchItem, listingsResponse.TotalResult));
                        LoadRecentSearches();
                        if (_searchItem is PlainTextSearchItem)
                        {
                            ShowViewModel<SearchResultsViewModel>(_searchItem as PlainTextSearchItem);
                        }
                        else
                        {
                            var item = _searchItem as GeoLocationSearchItem;
                            ShowViewModel<SearchResultsViewModel>(item.Location);                            
                        }
                        //Need to navigate here
                        //_view.DisplayRecentSearches(_state.RecentSearches);
                        //var presenter = new SearchResultsPresenter(_navigationService, _state, listingsResponse,
                        //                                            _searchItem, _propertyDataSource);
                        //_navigationService.PushPresenter(presenter);
                        ShowSelectLocation = false;
                    }
                }
                else if (response is PropertyLocationsResult)
                {
                    var results =((PropertyLocationsResult) response).Data;
                    SuggestedLocations.Clear();
                    foreach (Location location in results)
                    {
                        SuggestedLocations.Add(location);
                    }
                    ShowSelectLocation = true;
                }
                else
                {
                    Message="The location given was not recognised.";
                }

                IsBusy = false;
            }, error =>
            {
                Message="An error occurred while searching. Please check your network connection and try again.";
                IsBusy = false;
            });
        }
       

 


    }
}
