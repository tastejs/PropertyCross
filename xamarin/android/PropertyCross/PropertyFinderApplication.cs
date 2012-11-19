using System;
using Android.App;
using Android.Runtime;

namespace com.propertycross.xamarin.android
{
	[Application]
	public class PropertyFinderApplication : Application
	{
		public PropertyFinderApplication()
			: base()
		{
		}

		public PropertyFinderApplication(IntPtr javaReference, JniHandleOwnership transfer)
			: base(javaReference, transfer)
		{
		}

		public object Presenter
		{
			get;
			set; 
		}

		public Activity CurrentActivity
		{
			get;
			set;
		}
	}
}

