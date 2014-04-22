using System;
using Android.App;
using Android.Content;
using PropertyCross.Presenter;
using com.propertycross.xamarin.android.Views;

namespace com.propertycross.xamarin.android
{
	public class NavigationService : INavigationService
	{
		private PropertyCrossApplication application;

		public NavigationService(PropertyCrossApplication app)
		{
			application = app;
		}

		public void PushPresenter(object presenter)
		{
			object oldPresenter = application.Presenter;
			if(presenter != oldPresenter)
			{
				application.Presenter = presenter;
				Intent i = null;

				if(presenter is SearchResultsPresenter)
				{
					i = new Intent(application.CurrentActivity, typeof(SearchResultsView));
				}
				else if(presenter is PropertyPresenter)
				{
					i = new Intent(application.CurrentActivity, typeof(PropertyView));
				}
				else if(presenter is FavouritesPresenter)
				{
					i = new Intent(application.CurrentActivity, typeof(FavouritesView));
				}

				if(i != null)
					application.CurrentActivity.StartActivity(i);
			}
		}
	}
}

