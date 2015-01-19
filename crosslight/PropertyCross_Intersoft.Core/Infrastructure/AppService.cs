using System;
using Intersoft.AppFramework;
using Intersoft.AppFramework.Services;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Containers;
using Intersoft.Crosslight.Data;
using Intersoft.Crosslight.Data.EntityModel;
using Intersoft.Crosslight.Data.SQLite;
using Intersoft.Crosslight.Mobile;
using Intersoft.Crosslight.RestClient;
using Intersoft.Crosslight.Services;
using PropertyCross_Intersoft.Models;
using PropertyCross_Intersoft.ModelServices;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Infrastructure
{
    public sealed class CrosslightAppAppService : ApplicationServiceBase
    {
        #region Constructors

        public CrosslightAppAppService(IApplicationContext context)
            : base(context)
        {
            // To learn more about social network integrations,
            // please refer to http://developer.intersoftpt.com/display/crosslight/Integration+with+Social+Networks

            // configure app settings
            AppSettings appSettings = new AppSettings();
            appSettings.SingleSignOnAppId = "PropertyCross_Intersoft";
            appSettings.WebServerUrl = "http://192.168.10.85:57315";
            appSettings.BaseAppUrl = appSettings.WebServerUrl;
            appSettings.BaseImageUrl = appSettings.BaseAppUrl + "/images/";
            appSettings.RestServiceUrl = appSettings.BaseAppUrl + "/data/Inventory";
            appSettings.RequiresInternetConnection = true;
            appSettings.LocalDatabaseName = "PropertyCross.db3";
            appSettings.LocalDatabaseLocation = LocalFolderKind.Data;

            // shared services registration
            this.GetService<ITypeResolverService>().Register(typeof(CrosslightAppAppService).Assembly);

            // components specific registration
            this.GetService<IActivatorService>().Register<IRestClient>(c => new RestClient(appSettings.RestServiceUrl));

            // application-specific containers registration
            // such as data repositories and account services
            Container.Current.RegisterInstance(appSettings);
            Container.Current.Register<IEntityContainer>("Default", c => new EntityContainer()).WithLifetimeManager(new ContainerLifetime());

            // for best practices, data repositories shouldn't use life-time container
            Container.Current.Register<IPropertyRepository>(c => new PropertyRepository());

            // add new services (extensions)
            ServiceProvider.AddService<IResourceLoaderService, ResourceLoaderService>();
            ServiceProvider.AddService<IResourceCacheService, ResourceCacheService>();
            ServiceProvider.AddService<IImageLoaderService, ImageLoaderService>();
            ServiceProvider.AddService<ISQLiteService, SQLiteService>();  
        }

        #endregion

        #region Methods

        protected override void OnStart(StartParameter parameter)
        {
            base.OnStart(parameter);

            ISQLiteService service = ServiceProvider.GetService<ISQLiteService>();
            ISQLiteAsyncConnection connection = service.OpenDefaultConnection();
           
            if (!connection.Connection.TableExists<Property>())
                connection.CreateTableAsync<Property>();

            if (!connection.Connection.TableExists<RecentSearch>())
                connection.CreateTableAsync<RecentSearch>();

            // Set the root ViewModel to be displayed at startup
            this.SetRootViewModel<PropertySearchViewModel>();
        }

        #endregion
    }
}