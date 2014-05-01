using System;
using PropertyCross.Presenter;
using Android.Content;
using Android.App;

namespace com.propertycross.xamarin.android
{
	public class MarshalInvokeService : IMarshalInvokeService
	{
		private PropertyCrossApplication application;

		public MarshalInvokeService(PropertyCrossApplication application)
		{
			this.application = application;
		}

		public void Invoke (Action action)
		{
			application.CurrentActivity.RunOnUiThread(() => action());
		}
	}
}

