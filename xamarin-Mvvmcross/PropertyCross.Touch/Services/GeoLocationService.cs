using System;
using System.Linq;
using MonoTouch.CoreLocation;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Touch.Services
{
    public class GeoLocationService : IGeoLocationService
    {
        CLLocationManager locationManager = new CLLocationManager();

        public GeoLocationService()
        {
        }


        #region IGeoLocationService implementation

        public void GetLocation(Action<GeoLocation> callback)
        {
            EventHandler<CLLocationsUpdatedEventArgs> handler = null;
            handler = (s, e) =>
            {
                locationManager.StopUpdatingLocation();

                var coordinate = e.Locations.First().Coordinate;
                callback(new GeoLocation()
                {
                    Latitude = coordinate.Latitude,
                    Longitude = coordinate.Longitude
                });

                locationManager.LocationsUpdated -= handler;
            };
            locationManager.LocationsUpdated += handler;

            /*locationManager.Failed += (sender, e) => 
              {
                Debug.WriteLine("Failed");
              };

            locationManager.AuthorizationChanged+= (sender, e) => 
            {
              Debug.WriteLine("Failed");
            };*/

            locationManager.StartUpdatingLocation();
        }

        #endregion

    }
}

