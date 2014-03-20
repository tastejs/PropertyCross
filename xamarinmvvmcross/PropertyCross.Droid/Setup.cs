using Android.Content;
using Android.Locations;
using Cirrious.CrossCore;
using Cirrious.CrossCore.Platform;
using Cirrious.MvvmCross.Droid.Platform;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.Domain.Services;
using PropertyCross.Droid.Services;

namespace PropertyCross.Droid
{
    public class Setup : MvxAndroidSetup
    {
        public Setup(Context applicationContext) : base(applicationContext)
        {
        }

        protected override IMvxApplication CreateApp()
        {
            return new Core.App();
        }
		
        protected override IMvxTrace CreateDebugTrace()
        {
            return new DebugTrace();
        }

        protected override void InitializeLastChance()
        {
            Mvx.RegisterSingleton<IGeoLocationService>( ()=>new GeoLocationService(LocationManager.FromContext(ApplicationContext), new MarshalInvokeService()));
          
            Mvx.RegisterType<IMarshalInvokeService, MarshalInvokeService>();
          

            base.InitializeLastChance();
        }
    }
}