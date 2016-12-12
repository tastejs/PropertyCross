﻿using System;
using PropertyCross.Core.Domain.Model;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.Domain.SearchItem
{
  /// <summary>
  /// Represents a search against a geo-location.
  /// </summary>
  public class GeoLocationSearchItem : SearchItemBase
  {
    public GeoLocation Location { get; set; }

    public GeoLocationSearchItem()
    {
    }

    public GeoLocationSearchItem(GeoLocation location)
    {
      Location = location;
      DisplayText = string.Format("{0:F2}, {1:F2}", location.Latitude, location.Longitude);
    }

    public override void FindProperties(PropertyDataSource dataSource,
      int pageNumber, Action<PropertyDataSourceResult> callback, Action<Exception> error)
    {
      dataSource.FindProperties(Location.Latitude, Location.Longitude, pageNumber, callback, error);
    }
  }
}
