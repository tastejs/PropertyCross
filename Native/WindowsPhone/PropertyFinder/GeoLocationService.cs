using System;
using PropertyFinder.ViewModel;
using System.Device.Location;
using System.Diagnostics;

namespace PropertyFinder
{
  public class GeoLocationService : IGeoLocationService
  {
    private GeoLocation _currentLocation;

    private GeoCoordinateWatcher _watcher;

    public GeoLocationService()
    {
      _watcher = new GeoCoordinateWatcher();
      _watcher.StatusChanged += Watcher_StatusChanged;
      _watcher.PositionChanged += Watcher_PositionChanged;
      _watcher.Start();
    }

    private void Watcher_PositionChanged(object sender, GeoPositionChangedEventArgs<GeoCoordinate> e)
    {
      Debug.WriteLine("Watcher_PositionChanged ({0}, {1})",
        e.Position.Location.Latitude, e.Position.Location.Longitude);

      _currentLocation = new GeoLocation()
      {
        Latitude = e.Position.Location.Latitude,
        Longitude = e.Position.Location.Longitude
      };
    }

    private void Watcher_StatusChanged(object sender, GeoPositionStatusChangedEventArgs e)
    {
      Debug.WriteLine("Watcher_StatusChanged ({0})", e.Status);

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
