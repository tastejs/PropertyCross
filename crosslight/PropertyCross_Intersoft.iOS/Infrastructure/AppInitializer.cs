using PropertyCross_Intersoft.Infrastructure;
using Intersoft.Crosslight;
using Intersoft.Crosslight.iOS;
using Sqlite = Intersoft.Crosslight.Data.SQLite;

namespace PropertyCross_Intersoft.iOS.Infrastructure
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
            // preserve these assemblies so they are not removed by the mtouch linker
            UIApplicationDelegate.PreserveAssembly((typeof(Sqlite.ServiceInitializer).Assembly));
        }

        #endregion
    }
}