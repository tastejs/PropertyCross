using System;
using Android.App;
using Android.Runtime;
using Android.Content;

namespace com.propertycross.xamarin.android
{
	[Application]
	public class PropertyCrossApplication : Application
	{
		public PropertyCrossApplication()
			: base()
		{
		}

		public PropertyCrossApplication(IntPtr javaReference, JniHandleOwnership transfer)
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

		public static PropertyCrossApplication GetApplication(Context context)
		{
			return (PropertyCrossApplication)context.ApplicationContext;
		}
	}
}

