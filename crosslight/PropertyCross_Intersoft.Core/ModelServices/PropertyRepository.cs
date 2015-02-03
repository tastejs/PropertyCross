﻿using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intersoft.AppFramework.Models;
using Intersoft.AppFramework.ModelServices;
using Intersoft.Crosslight.Data.ComponentModel;
using Intersoft.Crosslight.Data.EntityModel;
using Intersoft.Crosslight.RestClient;
using PropertyCross_Intersoft.Models;

namespace PropertyCross_Intersoft.ModelServices
{
    public class PropertyRepository : RestRepository<Property, string>, IPropertyRepository
    {
        #region Constructors

        public PropertyRepository()
        {
            this.BaseUrl = "http://api.nestoria.co.uk/";
        }

        #endregion

        #region Methods

        public async override Task<ISelectResult<Property>> GetAllAsync(ISelectParameter selectParameter)
        {
            var request = this.InitializeGetAllAsyncRequest(selectParameter.QueryDescriptor);
            var response = await this.ExecuteAsync<SearchResultResponse>(request);
            
            return new Intersoft.AppFramework.Models.SelectResult<Property> 
            { 
                Items = response.Data.Response.listings,
                ItemCount = response.Data.Response.TotalResults
            };
        }

        protected override IRestRequest InitializeGetAllAsyncRequest(QueryDescriptor queryDescriptor)
        {
            FilterDescriptor locationFilter = queryDescriptor.FilterDescriptors.OfType<FilterDescriptor>().FirstOrDefault(o => o.PropertyName == "Location");
            IRestRequest request = new RestRequest("api", HttpMethod.GET);
            request.AddParameter("country","uk");
            request.AddParameter("action", "search_listings");
            request.AddParameter("encoding", "json");
            request.AddParameter("listing_type", "buy");
           
            if (locationFilter.Value.ToString().Contains(","))
                request.AddParameter("centre_point", locationFilter.Value.ToString());
            else
                request.AddParameter("place_name", locationFilter.Value.ToString());

            request.AddParameter("page", queryDescriptor.PageDescriptor.PageIndex + 1);
            return request;
        }

        #endregion

        #region IEditableRepository Members

        // The IEditableRepository isn't really needed in this app as it only fetches data from REST
        // We need to implement this interface for conformance to DataListViewModelBase class to take advantage
        // of the comprehensive data features already built in Crosslight App Framework.

        public ICollection<Property> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public ICollection<Property> GetAll(Intersoft.AppFramework.Models.ISelectParameter selectParameter)
        {
            throw new System.NotImplementedException();
        }

        public Property GetSingle(object key)
        {
            throw new System.NotImplementedException();
        }

        public Property GetSingle(Dictionary<string, object> keys)
        {
            throw new System.NotImplementedException();
        }

        public new Task<Intersoft.AppFramework.Models.ISelectResult<Property>> GetAllAsync()
        {
            throw new System.NotImplementedException();
        }

        public Task<Property> GetSingleAsync(object key)
        {
            throw new System.NotImplementedException();
        }

        Task<Property> IAsyncDataRepository<Property>.GetSingleAsync(Dictionary<string, object> keys)
        {
            throw new System.NotImplementedException();
        }

        public Property Create()
        {
            throw new System.NotImplementedException();
        }

        public void Delete(Property entity)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(IEnumerable<Property> entities)
        {
            throw new System.NotImplementedException();
        }

        public void Insert(Property entity)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Property entity)
        {
            throw new System.NotImplementedException();
        }

        public void RejectChanges()
        {
            throw new System.NotImplementedException();
        }

        public void RejectChanges(IEnumerable<Property> entities)
        {
            throw new System.NotImplementedException();
        }

        public IEntityContainer EntityContainer
        {
            get { throw new System.NotImplementedException(); }
        }

        public Task<Intersoft.AppFramework.Models.ISaveResult> SaveChangesAsync()
        {
            throw new System.NotImplementedException();
        }

        public Property GetSingle(string key)
        {
            throw new System.NotImplementedException();
        }

        Task<Property> IAsyncDataRepository<Property, string>.GetSingleAsync(string key)
        {
            throw new System.NotImplementedException();
        }

        #endregion
    }
}
