using System;

namespace PropertyFinder.Model
{
  public interface IJsonPropertySearch
  {
    void FindProperties(string location, int pageNumber, Action<string> callback);

    void FindProperties(double latitude, double longitude, int pageNumber, Action<string> callback);
  }
}
