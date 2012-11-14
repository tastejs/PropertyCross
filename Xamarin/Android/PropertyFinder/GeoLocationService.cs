using System;
using Android.Locations;
using Android.OS;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	public class GeoLocationService : Java.Lang.Object, ILocationListener, IGeoLocationService
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
			if(!manager.IsProviderEnabled(LocationManager.GpsProvider))
			{
				DoCallback(null);
			}
			else
			{
				manager.RequestLocationUpdates(LocationManager.GpsProvider, 1000, 10, this);
			}
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
				DoCallback(g);
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

		public void Unsubscribe()
		{
			if (manager != null)
				manager.RemoveUpdates(this);
		}

		private void DoCallback(GeoLocation g)
		{
			pendingCallback(g);
			pendingCallback = null;
		}
	}
}