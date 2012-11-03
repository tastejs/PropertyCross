using System;
using Android.App;
using Android.Content;
using PropertyFinder.Presenter;
using PropertyFinder.Views;

namespace PropertyFinder
{
	public class NavigationService : INavigationService
	{
		private PropertyFinderApplication application;

		public Activity Activity { get; set; }

		public NavigationService(PropertyFinderApplication app)
		{
			application = app;
		}

		public void PushPresenter(object presenter)
		{
			object oldPresenter = application.Presenter;
			if(presenter != oldPresenter)
			{
				application.Presenter = presenter;

				if(presenter is SearchResultsPresenter)
				{
					Activity.StartActivity(typeof(SearchResultsView));
				}
				else if(presenter is PropertyPresenter)
				{
					Activity.StartActivity(typeof(PropertyView));
				}
			}
		}
	}
}

