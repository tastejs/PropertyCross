using System;
using System.Timers;
using Android.Locations;
using Android.OS;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Droid.Services
{
	public class GeoLocationService : Java.Lang.Object, ILocationListener, IGeoLocationService, IDisposable
	{
		private static readonly long FIVE_MINUTES = 1000 * 60 * 5;
		private static readonly long SEVEN_SECONDS = 1000 * 7;
		private static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
		private LocationManager manager;
		private Action<GeoLocation> pendingCallback;
		private Timer timer;
		private IMarshalInvokeService marshal;

		public GeoLocationService(LocationManager locationManager, IMarshalInvokeService marshalService)
		{
			manager = locationManager;
			marshal = marshalService;
			timer = new Timer(SEVEN_SECONDS);
			timer.Elapsed += OnTimeout;
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
				if(IsLastLocationAccurateEnough(l))
				{
					DoCallback(ToGeolocation(l));
				}

				manager.RequestLocationUpdates(provider, 1000, 10, this);
				timer.Start();
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

		private void OnTimeout(object sender, ElapsedEventArgs e)
		{
			marshal.Invoke(() =>
			{
				Unsubscribe();
				DoCallback(null);
			});
		}

		public void OnLocationChanged(Location location)
		{
			Unsubscribe();

			if (location != null)
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
			timer.Stop();
		}

		private void DoCallback(GeoLocation g)
		{
			if(pendingCallback != null)
			{
				pendingCallback(g);
				pendingCallback = null;
			}
		}

		public void Dispose()
		{
			base.Dispose();
			timer.Elapsed -= OnTimeout;
			timer.Dispose();
		}
	}
}