using System;
using System.Net;
using System.Linq;
using PropertyFinder.Presenter;
using System.Collections.Generic;

namespace PropertyFinder.Model
{
  public class JsonWebPropertySearch : IJsonPropertySearch
  {
    private Dictionary<string,object> _commonParams = new Dictionary<string,object>()
        {
            {"country", "uk"},
            {"pretty", 1},
            {"action", "search_listings"},
            {"encoding", "json"},
            {"listing_type", "buy"}
        };

    private IMarshalInvokeService _marshal;

    public JsonWebPropertySearch(IMarshalInvokeService marshal)
    {
      _marshal = marshal;
    }
    
    public void FindProperties(string location, int pageNumber, Action<string> callback, Action<Exception> error)
    {
      var parameters = new Dictionary<string,object>(_commonParams);
      parameters.Add("place_name", location);
      parameters.Add("page", pageNumber);
      string url = "http://api.nestoria.co.uk/api?" + ToQueryString(parameters);

      WebClient webClient = new WebClient();
      webClient.DownloadStringCompleted += (s, e) =>
      {
        try
        {
          string result = e.Result;
          _marshal.Invoke(() => callback(result));
        }
        catch (Exception ex)
        {
          _marshal.Invoke(() => error(ex));
        }
      };

      webClient.DownloadStringAsync(new Uri(url));
    }

    public void FindProperties(double latitude, double longitude, int pageNumber, Action<string> callback, Action<Exception> error)
    {
      var parameters = new Dictionary<string, object>(_commonParams);
      parameters.Add("centre_point", latitude.ToString() + "," + longitude.ToString());
      parameters.Add("page", pageNumber);
      string url = "http://api.nestoria.co.uk/api?" + ToQueryString(parameters);

      WebClient webClient = new WebClient();
      webClient.DownloadStringCompleted += (s, e) =>
      {
        try
        {
          string result = e.Result;
          _marshal.Invoke(() => callback(result));
        }
        catch (Exception ex)
        {
          _marshal.Invoke(() => error(ex));
        }
      };

      webClient.DownloadStringAsync(new Uri(url));
    }

    private string ToQueryString(Dictionary<string, object> parameters)
    {
      return String.Join("&amp;", parameters.Keys.Select(
          key => String.Format("{0}={1}", HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(parameters[key].ToString()))).ToArray());
    }
  }
}
