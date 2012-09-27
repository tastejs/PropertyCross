using System;
using PropertyFinder.Presenter;
using MonoTouch.UIKit;

namespace PropertyFinder
{
	public class NavigationService : INavigationService
	{

    private UINavigationController _navigationController;

		public NavigationService (UINavigationController navigationController)
		{
      _navigationController = navigationController;
		}

		#region INavigationService implementation

		public void PushPresenter (object presenter)
    {
      if (presenter is SearchResultsPresenter)
      {
        var viewController = new SearchResultsViewController(presenter as SearchResultsPresenter);
        _navigationController.PushViewController(viewController, true);
      }

      if (presenter is PropertyPresenter)
      {
        var viewController = new PropertyViewController(presenter as PropertyPresenter);
        _navigationController.PushViewController(viewController, true);
      }
		}

		#endregion

	}
}

