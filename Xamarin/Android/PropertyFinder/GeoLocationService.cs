using System;
using Android.Locations;
using Android.OS;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	public class GeoLocationService : ILocationListener, IGeoLocationService
	{
		private LocationManager manager;
		private Action<GeoLocation> pendingCallback;

		public GeoLocationService(LocationManager m)
		{
			manager = m;
		}

		public void GetLocation(Action<GeoLocation> callback)
		{
			pendingCallback = callback;
			manager.RequestLocationUpdates(LocationManager.GpsProvider, 1000, 10, this);
		}

		public void OnLocationChanged (Location location)
		{
			Unsubscribe ();

			if (location != null && pendingCallback != null)
			{
				GeoLocation g = new GeoLocation ()
				{
					Latitude = location.Latitude,
					Longitude = location.Longitude
				};
				pendingCallback(g);
				pendingCallback = null;
			}
		}
		
		public void OnProviderDisabled(string provider)
		{
			Unsubscribe();
		}
		
		public void OnProviderEnabled(string provider)
		{
		}
		
		public void OnStatusChanged(string provider, Availability status, Bundle extras)
		{
		}

		private void Unsubscribe()
		{
			if (manager != null)
				manager.RemoveUpdates(this);
		}

		public void Dispose()
		{
			Unsubscribe();
		}

		public IntPtr Handle { get { return new IntPtr (); } }
	}
}