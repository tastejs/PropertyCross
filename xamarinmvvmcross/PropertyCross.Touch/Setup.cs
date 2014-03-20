using Cirrious.CrossCore;
using MonoTouch.UIKit;
using Cirrious.CrossCore.Platform;
using Cirrious.MvvmCross.ViewModels;
using Cirrious.MvvmCross.Touch.Platform;
using PropertyCross.Core.Domain.Services;
using PropertyCross.Touch.Services;

namespace PropertyCross.Touch
{
	public class Setup : MvxTouchSetup
	{
		public Setup(MvxApplicationDelegate applicationDelegate, UIWindow window)
            : base(applicationDelegate, window)
		{
		}

		protected override IMvxApplication CreateApp ()
		{
			return new Core.App();
		}
		
        protected override IMvxTrace CreateDebugTrace()
        {
            return new DebugTrace();
        }

        protected override void InitializeLastChance()
        {
            Mvx.RegisterType<IGeoLocationService, GeoLocationService>();

            Mvx.RegisterType<IMarshalInvokeService, MarshalInvokeService>();


            base.InitializeLastChance();
        }
	}
}