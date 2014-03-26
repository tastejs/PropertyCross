using System;
using PropertyCross.Core.Domain.Model;

namespace PropertyCross.Core.Domain.SearchItem
{
  /// <summary>
  /// Represents a 'property search', which can either be a plain-text search term
  /// or a geolocation.
  /// </summary>
  public abstract class SearchItemBase
  {
    /// <summary>
    /// The text displayed to the user for this search
    /// </summary>
    public string DisplayText { get; set; }

    /// <summary>
    /// Executes the search that this item represents.
    /// </summary>
    public abstract void FindProperties(PropertyDataSource dataSource,
      int pageNumber, Action<PropertyDataSourceResult> callback, Action<Exception> error);
  }
}
