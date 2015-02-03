using System.Runtime.Serialization;

namespace PropertyCross_Intersoft.Models
{
    public class SearchResultResponse
    {
        [DataMember(Name = "response")]
        public Response Response { get; set; }
    }
}
