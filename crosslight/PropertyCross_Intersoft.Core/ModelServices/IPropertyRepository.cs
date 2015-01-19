using Intersoft.AppFramework.ModelServices;
using Intersoft.Crosslight;
using PropertyCross_Intersoft.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PropertyCross_Intersoft.ModelServices
{
    public partial interface IPropertyRepository : IEditableEntityRepository<Property, string>
    {
    }
}