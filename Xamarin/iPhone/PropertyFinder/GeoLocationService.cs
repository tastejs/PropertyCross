using System;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	public class GeoLocationService : IGeoLocationService
	{
		public GeoLocationService ()
		{
		}

		#region IGeoLocationService implementation

		public void GetLocation (Action<GeoLocation> callback)
		{

		}

		#endregion

	}
}

