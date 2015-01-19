using System.Collections.Generic;
using Intersoft.Crosslight;
using Intersoft.AppFramework.Models;

namespace PropertyCross_Intersoft.Models
{
    public class SearchResult
    {
        public ISelectResult<Property> Items { get; set; }
        public string Location { get; set; }
    }
}