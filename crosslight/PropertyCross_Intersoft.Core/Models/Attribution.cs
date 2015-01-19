using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace PropertyCross_Intersoft.Models
{
    public class Attribution
    {
        [DataMember(Name = "img_height")]
        public int ImgHeight { get; set; }

        [DataMember(Name = "img_url")]
        public string ImgUrl { get; set; }

        [DataMember(Name = "img_width")]
        public int ImgWidth { get; set; }

        [DataMember(Name = "link_to_img")]
        public string LinkToImg { get; set; }
    }
}
