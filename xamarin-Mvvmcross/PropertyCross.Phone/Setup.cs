using Cirrious.CrossCore;
using Cirrious.CrossCore.Platform;
using Cirrious.MvvmCross.ViewModels;
using Cirrious.MvvmCross.WindowsPhone.Platform;
using Microsoft.Phone.Controls;
using PropertyCross.Core.Domain.Services;
using PropertyCross.WindowsPhone.Services;

namespace PropertyCross.WindowsPhone
{
    public class Setup : MvxPhoneSetup
    {
        public Setup(PhoneApplicationFrame rootFrame) : base(rootFrame)
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
            Mvx.RegisterType<IGeoLocationService,GeoLocationService>();
        
            Mvx.RegisterType<IMarshalInvokeService, MarshalInvokeService>();
          

            base.InitializeLastChance();
        }
    }
}