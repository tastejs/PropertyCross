using System;
using PropertyFinder.ViewModel;
using WPNavigationService = System.Windows.Navigation.NavigationService;

namespace PropertyFinder
{
  public class NavigationService : INavigationService
  {
    private WPNavigationService _navigationService;

    public NavigationService(WPNavigationService navigationService)
    {
      _navigationService = navigationService;
    }

    public void PushViewModel(object presenter)
    {
      App.Instance.NavigateToViewModel(presenter);
    }
  }
}
