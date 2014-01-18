using System;

namespace PropertyCross.Core.Domain.Services
{
  /// <summary>
  /// A service which provides location information.
  /// </summary>
  public interface IGeoLocationService
  {
    void GetLocation(Action<GeoLocation> callback);
  }

  public class GeoLocation : IEquatable<GeoLocation>
  {
    public double Latitude {get; set;}

    public double Longitude {get; set;}


      public bool Equals(GeoLocation other)
      {
          return this.Latitude == other.Latitude && this.Longitude == other.Longitude;
      }
  }
}
