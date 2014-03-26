using Android.App;
using Android.Content.PM;
using Cirrious.MvvmCross.Droid.Views;

namespace PropertyCross.Droid
{
    [Activity(
        Label = "@string/app_name"
		, MainLauncher = true
		, Icon = "@drawable/ic_launcher"
		, Theme = "@style/Theme.Splash"
		, NoHistory = true
		, ScreenOrientation = ScreenOrientation.Portrait)]
    public class SplashScreen : MvxSplashScreenActivity
    {
        public SplashScreen()
            : base(Resource.Layout.SplashScreen)
        {
        }
    }
}