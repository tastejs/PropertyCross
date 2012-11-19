using System;
using PropertyFinder.Presenter;
using Android.Content;
using Android.App;

namespace com.propertycross.xamarin.android
{
	public class MarshalInvokeService : IMarshalInvokeService
	{
		private PropertyFinderApplication application;

		public MarshalInvokeService(PropertyFinderApplication application)
		{
			this.application = application;
		}

		public void Invoke (Action action)
		{
			application.CurrentActivity.RunOnUiThread(() => action());
		}
	}
}

