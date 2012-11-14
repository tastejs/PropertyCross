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
		private long FIVE_MINUTES = 1000 * 60 * 5;
		private static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

		public GeoLocationService(LocationManager m)
		{
			manager = m;
		}

		public void GetLocation(Action<GeoLocation> callback)
		{
			pendingCallback = callback;

			Criteria c = new Criteria()
			{
				Accuracy = Accuracy.Fine,
			};

			string provider = manager.GetBestProvider(c, true);
			if(string.IsNullOrEmpty(provider))
			{
				DoCallback(null);
			}
			else
			{
				Location l = manager.GetLastKnownLocation(provider);
				if(IsLastLocationAccurateEnough(l) && pendingCallback != null)
				{
					DoCallback(ToGeolocation(l));
				}

				manager.RequestLocationUpdates(provider, 1000, 10, this);
			}
		}

		private bool IsLastLocationAccurateEnough(Location l)
		{
			return l != null &&
				l.Time >= UnixTimeNow() - FIVE_MINUTES;
		}

		private long UnixTimeNow()
		{
			return (DateTime.Now.Ticks - Epoch.Ticks) / TimeSpan.TicksPerMillisecond;
		}

		private GeoLocation ToGeolocation(Location location)
		{
			return new GeoLocation ()
			{
				Latitude = location.Latitude,
				Longitude = location.Longitude
			};
		}

		public void OnLocationChanged (Location location)
		{
			Unsubscribe ();

			if (location != null && pendingCallback != null)
			{
				DoCallback(ToGeolocation(location));
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