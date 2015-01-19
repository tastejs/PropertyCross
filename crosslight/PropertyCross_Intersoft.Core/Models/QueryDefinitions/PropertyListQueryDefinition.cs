using Intersoft.AppFramework;
using Intersoft.Crosslight.Data.ComponentModel;
using System;

namespace PropertyCross_Intersoft.Models
{
    public class PropertyListQueryDefinition : QueryDefinitionBase
    {
         #region Constructors

        public PropertyListQueryDefinition()
        {

        }

        #endregion

        #region Methods

        public override QueryDescriptor GetQueryDescriptor()
        {
            QueryDescriptor queryDescriptor = this.GetBaseQueryDescriptor();
            this.AddFilter("Location", FilterOperator.StartsWith, this.FilterQuery);

            return queryDescriptor;
        }

        #endregion
    }
}