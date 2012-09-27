using System;
using PropertyFinder.Presenter;
using System.Device.Location;

namespace PropertyFinder
{
  public class GeoLocationService : IGeoLocationService
  {
    private GeoLocation _currentLocation;

    public GeoLocationService()
    {
      var watcher = new GeoCoordinateWatcher();
      watcher.StatusChanged += Watcher_StatusChanged;
      watcher.PositionChanged += Watcher_PositionChanged;
      watcher.Start();
    }

    private void Watcher_PositionChanged(object sender, GeoPositionChangedEventArgs<GeoCoordinate> e)
    {
      _currentLocation = new GeoLocation()
      {
        Latitude = e.Position.Location.Latitude,
        Longitude = e.Position.Location.Longitude
      };
    }

    private void Watcher_StatusChanged(object sender, GeoPositionStatusChangedEventArgs e)
    {
      switch (e.Status)
      {
        case GeoPositionStatus.Disabled:
          _currentLocation = null;
          break;

        case GeoPositionStatus.NoData:
          _currentLocation = null;
          break;
      }
    }


    public void GetLocation(Action<GeoLocation> callback)
    {
      callback(_currentLocation);
    }
  }
}
