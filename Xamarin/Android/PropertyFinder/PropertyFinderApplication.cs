using System;
using Android.App;
using Android.Runtime;

namespace PropertyFinder
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
	}
}

