using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace PropertyCross_Intersoft.Models
{
    public class Locations
    {
        [DataMember(Name = "center_lat")]
        public decimal CenterLat { get; set; }

        [DataMember(Name = "center_long")]
        public decimal CenterLong { get; set; }

        [DataMember(Name = "long_title")]
        public string LongTitle { get; set; }

        [DataMember(Name = "place_name")]
        public string PlaceName { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }
    }    
    
}
