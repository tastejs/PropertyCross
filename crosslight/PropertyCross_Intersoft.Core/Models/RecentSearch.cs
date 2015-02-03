using System;
using Intersoft.AppFramework.Models;
using Intersoft.Crosslight.Data.ComponentModel;

namespace PropertyCross_Intersoft.Models
{
    public class RecentSearch : ModelBase
    {
        [PrimaryKey]
        public string Recent { get; set; }

        public int TotalResult { get; set; }

        public DateTime Date { get; set; }
    }
}
