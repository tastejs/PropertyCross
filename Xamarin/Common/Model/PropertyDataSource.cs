using System;
using System.Net;
using Newtonsoft.Json.Linq;

namespace PropertyFinder.Model
{
  public class PropertyDataSource
  {
    private IJsonPropertySearch _jsonPropertySearch;

    public PropertyDataSource(IJsonPropertySearch jsonPropertySearch)
    {
      _jsonPropertySearch = jsonPropertySearch;
    }

    public void FindProperties(double latitude, double longitude, int pageNumber, Action<PropertyDataSourceResult> callback, Action<Exception> error)
    {
      _jsonPropertySearch.FindProperties(latitude, longitude, pageNumber,
        response => HandleResponse(response, callback), error);
    }

    public void FindProperties(string searchText, int pageNumber, Action<PropertyDataSourceResult> callback, Action<Exception> error)
    {
      _jsonPropertySearch.FindProperties(searchText, pageNumber,
        response => HandleResponse(response, callback), error);
    }


    private void HandleResponse(string jsonResponse, Action<PropertyDataSourceResult> callback)
    {
      JObject json = JObject.Parse(jsonResponse);

      string responseCode = (string)json["response"]["application_response_code"];

      if (responseCode == "100" || /* one unambiguous location */
          responseCode == "101" || /* best guess location */
          responseCode == "110"  /* large location, 1000 matches max */)
      {
        var result = new PropertyListingsResult(json);
        callback(result);

      }
      else if (responseCode == "200" || /* ambiguous location */
               responseCode == "202" /* mis-spelled location */)
      {
        var result = new PropertyLocationsResult(json);
        callback(result);
      }
      else
      {
        /*
        201 - unkown location
        210 - coordinate error
        */
        callback(new PropertyUnknownLocationResult());
      };
    }
  }
}
