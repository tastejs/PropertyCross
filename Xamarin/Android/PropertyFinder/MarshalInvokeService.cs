using System;
using PropertyFinder.Presenter;
using Android.Content;
using Android.App;

namespace PropertyFinder
{
	public class MarshalInvokeService : IMarshalInvokeService
	{
		private Activity activity;

		public MarshalInvokeService(Activity activity)
		{
			this.activity = activity;
		}

		public void Invoke (Action action)
		{
			activity.RunOnUiThread(() => action());
		}
	}
}

