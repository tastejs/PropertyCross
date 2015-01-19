using PropertyCross_Intersoft.Infrastructure;
using Intersoft.Crosslight;
using Intersoft.Crosslight.WinPhone;

namespace PropertyCross_Intersoft.WinPhone.Infrastructure
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
            Application.PreserveAssembly((typeof(Intersoft.Crosslight.Data.SQLite.ServiceInitializer).Assembly));
        }

        #endregion
    }
}