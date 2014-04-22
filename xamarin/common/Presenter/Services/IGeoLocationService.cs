using System;

namespace PropertyCross.Presenter
{
  /// <summary>
  /// A service which provides location information.
  /// </summary>
  public interface IGeoLocationService
  {
    void GetLocation(Action<GeoLocation> callback);
  }

  public class GeoLocation
  {
    public double Latitude {get; set;}

    public double Longitude {get; set;}
  }
}
