using System;
using PropertyCross.Presenter;
using WPNavigationService = System.Windows.Navigation.NavigationService;



namespace PropertyCross
{
  public class NavigationService : INavigationService
  {
    private WPNavigationService _navigationService;

    public NavigationService(WPNavigationService navigationService)
    {
      _navigationService = navigationService;
    }

    public void PushPresenter(object presenter)
    {
      App.Instance.CurrentPresenter = presenter;

      if (presenter is SearchResultsPresenter)
      {
        _navigationService.Navigate(new Uri("/SearchResultsView.xaml", UriKind.Relative));
      }
      else if (presenter is PropertyPresenter)
      {
        _navigationService.Navigate(new Uri("/PropertyView.xaml", UriKind.Relative));
      }
      else if (presenter is FavouritesPresenter)
      {
        _navigationService.Navigate(new Uri("/FavouritesView.xaml", UriKind.Relative));
      }
    }
  }
}
