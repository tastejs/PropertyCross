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
  public partial class PropertyFinderView : PhoneApplicationPage
  {
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
        var source = new PropertyDataSource(new JsonWebPropertySearch());
        var geolocationService = new GeoLocationService();

        var statePersistence = new StatePersistenceService();
        PropertyFinderPersistentState state = statePersistence.LoadState();

        var viewModel = new PropertyFinderViewModel(state, source,
          new NavigationService(NavigationService), geolocationService);
        
        this.DataContext = viewModel;
      }
    }


  }
}