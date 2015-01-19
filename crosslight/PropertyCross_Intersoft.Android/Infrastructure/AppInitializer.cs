using PropertyCross_Intersoft.Infrastructure;
using Intersoft.Crosslight;
using PushNotification = Intersoft.Crosslight.Services.PushNotification.Android;
using Social = Intersoft.Crosslight.Services.Social.Android;

namespace PropertyCross_Intersoft.Android.Infrastructure
{
    public sealed class AppInitializer : IApplicationInitializer
    {
        #region IApplicationInitializer Members

        public IApplicationService GetApplicationService(IApplicationContext context)
        {
            return new CrosslightAppAppService(context);
        }

        public void InitializeApplication(IApplicationHost appHost)
        {
        }

        public void InitializeComponents(IApplicationHost appHost)
        {
        }

        public void InitializeServices(IApplicationHost appHost)
        {
            AndroidApp.PreserveAssembly((typeof(PushNotification.ServiceInitializer).Assembly));
            AndroidApp.PreserveAssembly((typeof(Social.ServiceInitializer).Assembly));
        }

        #endregion
    }
}