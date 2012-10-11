using System;
using PropertyFinder.Presenter;
using Microsoft.Phone.Controls;
using PropertyFinder.Model;
using System.Collections.Generic;
using System.Windows.Input;
using System.Windows;
using System.Windows.Navigation;
using System.Windows.Controls;

namespace PropertyFinder
{
  public partial class PropertyFinderView : PhoneApplicationPage, PropertyFinderPresenter.View
  {
    private PropertyFinderPresenter _presenter;

    // Constructor
    public PropertyFinderView()
    {
      InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
      base.OnNavigatedTo(e);

      if (e.NavigationMode != NavigationMode.Back)
      {
        var source = new PropertyDataSource(new JsonWebPropertySearch(new MarshalInvokeService()));
        var geolocationService = new GeoLocationService();

        var statePersistence = new StatePersistenceService();
        PropertyFinderPersistentState state = statePersistence.LoadState();

        _presenter = new PropertyFinderPresenter(state, source,
          new NavigationService(NavigationService), geolocationService);
        _presenter.SetView(this);
      }
    }

    public string SearchText
    {
      set
      {
        searchText.Text = value;
      }
    }

    public event EventHandler SearchButtonClicked = delegate { };

    public event EventHandler MyLocationButtonClicked = delegate { };

    public event EventHandler<LocationSelectedEventArgs> LocationSelected = delegate { };

    public event EventHandler FavouritesClicked = delegate { };

    public event EventHandler<SearchTextChangedEventArgs> SearchTextChanged = delegate { };

    public event EventHandler<RecentSearchSelectedEventArgs> RecentSearchSelected = delegate { };

    public void SetMessage(string message)
    {
      userMessage.Text = message;
    }

    public bool IsLoading
    {
      set
      {
        loadingIndicator.Visibility = value ? Visibility.Visible : Visibility.Collapsed;
        searchText.IsEnabled = !value;
        buttonMyLocation.IsEnabled = !value;
        buttonSearchGo.IsEnabled = !value;
      }
    }

    private void ApplicationBarFavourites_Click(object sender, EventArgs e)
    {
      FavouritesClicked(this, EventArgs.Empty);
    }

    private void Location_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
    {
      FrameworkElement fe = sender as FrameworkElement;
      Location location = fe.DataContext as Location;
      LocationSelected(this, new LocationSelectedEventArgs(location));
    }

    private void RecentSearch_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
    {
      FrameworkElement fe = sender as FrameworkElement;
      RecentSearch recentSearch = fe.DataContext as RecentSearch;
      RecentSearchSelected(this, new RecentSearchSelectedEventArgs(recentSearch));
    }

    private void ButtonSearchGo_Click(object sender, RoutedEventArgs e)
    {
      SearchButtonClicked(this, EventArgs.Empty);
    }

    private void ButtonMyLocation_Click(object sender, RoutedEventArgs e)
    {
      MyLocationButtonClicked(this, EventArgs.Empty);
    }

    private void SearchText_TextChanged(object sender, TextChangedEventArgs e)
    {
      SearchTextChanged(this, new SearchTextChangedEventArgs(searchText.Text));
    }
    
    public void DisplayRecentSearches(List<RecentSearch> recentSearches)
    {
      if (recentSearches == null || recentSearches.Count == 0)
      {
        recentSearchesContainer.Visibility = Visibility.Collapsed;
      }
      else
      {
        recentSearchesContainer.Visibility = Visibility.Visible;
        recentSearchList.ItemsSource = recentSearches.ToArray();
      }
    }


    public void DisplaySuggestedLocations(List<Location> locations)
    {
      if (locations == null)
      {
        locationsContainer.Visibility = Visibility.Collapsed;
      }
      else
      {
        locationsContainer.Visibility = Visibility.Visible;
        locationsList.ItemsSource = locations;
      }
    }
  }
}