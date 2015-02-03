using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace PropertyCross_Intersoft.Models
{
    public class Response
    {
        [DataMember(Name = "application_response_code")]
        public string ApplicationResponseCode { get; set; }

        [DataMember(Name = "application_response_text")]
        public string ApplicationResponseText { get; set; }

        public Attribution attribution { get; set; }

        [DataMember(Name = "created_http")]
        public string CreatedHttp { get; set; }

        [DataMember(Name = "created_unix")]
        public Int32 CreatedUnix { get; set; }

        [DataMember(Name = "link_to_url")]
        public string LinkToUrl { get; set; }

        [DataMember(Name = "listings")]
        public List<Property> listings { get; set; }

        public List<Locations> Locations { get; set; }

        [DataMember(Name = "page")]
        public string Page { get; set; }

        [DataMember(Name = "sort")]
        public string Sort { get; set; }

        [DataMember(Name = "status_code")]
        public string StatusCode { get; set; }

        [DataMember(Name = "status_text")]
        public string StatusText { get; set; }

        [DataMember(Name = "thanks")]
        public string Thanks { get; set; }

        [DataMember(Name = "total_pages")]
        public int TotalPages { get; set; }

        [DataMember(Name = "total_results")]
        public Int32 TotalResults { get; set; }

        [DataMember(Name = "we_are_hiring")]
        public string WeAreHiring { get; set; }
    }
}
