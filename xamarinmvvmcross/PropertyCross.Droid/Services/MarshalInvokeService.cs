using System;
using Cirrious.CrossCore;
using Cirrious.CrossCore.Droid.Platform;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Droid.Services
{
	public class MarshalInvokeService : IMarshalInvokeService
	{

		

		public void Invoke (Action action)
		{
		    var topActivity = Mvx.Resolve<IMvxAndroidCurrentTopActivity>();
            topActivity.Activity.RunOnUiThread(action);
		}
	}
}

