using System;
using System.Net;

namespace PropertyFinder.Model
{
  public interface IJsonPropertySearch
  {
    void FindProperties(string location, int pageNumber, Action<string> callback, Action<Exception> error);

    void FindProperties(double latitude, double longitude, int pageNumber, Action<string> callback, Action<Exception> error);
  }
}
