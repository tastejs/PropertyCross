using Cirrious.CrossCore;
using Cirrious.CrossCore.IoC;
using PropertyCross.Core.Domain.Model;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core
{
    public class App : Cirrious.MvvmCross.ViewModels.MvxApplication
    {
        public override void Initialize()
        {
            CreatableTypes()
                .EndingWith("Service")
                .AsInterfaces()
                .RegisterAsLazySingleton();

            Mvx.RegisterType<PropertyDataSource, PropertyDataSource>();
            Mvx.RegisterType<IStatePersistenceService, StatePersistenceService>();

            Mvx.RegisterType<IJsonPropertySearch, JsonWebPropertySearch>();           
            Mvx.RegisterSingleton(() =>
            {
                IStatePersistenceService state = Mvx.Resolve<IStatePersistenceService>();
                return state.LoadState();
            });

            RegisterAppStart<ViewModels.PropertyFinderViewModel>();
        }
    }
}