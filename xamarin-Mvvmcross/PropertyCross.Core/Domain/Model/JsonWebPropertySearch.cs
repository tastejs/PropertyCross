using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using Cirrious.MvvmCross.Plugins.Network.Rest;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.Domain.Model
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
    private readonly IMvxRestClient _restClient;

      public JsonWebPropertySearch(IMarshalInvokeService marshal, IMvxRestClient restClient)
    {
        _marshal = marshal;
        _restClient = restClient;
    }

      public void FindProperties(string location, int pageNumber, Action<string> callback, Action<Exception> error)
    {
      var parameters = new Dictionary<string,object>(_commonParams);
      parameters.Add("place_name", location);
      parameters.Add("page", pageNumber);
      string url = "http://api.nestoria.co.uk/api?" + ToQueryString(parameters);

      ExecuteWebRequest(url, callback, error);
    }

    public void FindProperties(double latitude, double longitude, int pageNumber, Action<string> callback, Action<Exception> error)
    {
      var parameters = new Dictionary<string, object>(_commonParams);
      parameters.Add("centre_point", latitude.ToString() + "," + longitude.ToString());
      parameters.Add("page", pageNumber);
      string url = "http://api.nestoria.co.uk/api?" + ToQueryString(parameters);

      ExecuteWebRequest(url, callback, error);
    }

      private void ExecuteWebRequest(string url, Action<string> callback, Action<Exception> error)
      {
          //WebClient webClient = new WebClient();
          MvxRestRequest request = new MvxRestRequest(url);


          // create a timeout timer
          Timer timer = null;
          TimerCallback timerCallback = state =>
          {
              timer.Dispose();

              //Doesnt appear to be a way to cancel the request...   webClient.CancelAsync();
              error(new TimeoutException());
          };
          timer = new Timer(timerCallback, null, 5000, 5000);

          _restClient.MakeRequest(request, (MvxStreamRestResponse response) =>
          {
              timer.Dispose();
              StreamReader reader = new StreamReader(response.Stream);
              string result = reader.ReadToEnd();
              _marshal.Invoke(() => callback(result));              
          }

              ,
              exception =>
              {
                  timer.Dispose();
                  _marshal.Invoke(() => error(exception));                  
              }
              );
      }

      private string ToQueryString(Dictionary<string, object> parameters)
    {
      var items = parameters.Keys.Select(
        key => String.Format("{0}={1}", key, parameters[key].ToString())).ToArray();

      return String.Join("&amp;", items);
    }
  }
}

