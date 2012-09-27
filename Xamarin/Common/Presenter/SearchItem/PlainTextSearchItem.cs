
using System;
using PropertyFinder.Model;


namespace PropertyFinder.Presenter
{
  /// <summary>
  /// A search against a plain-text string
  /// </summary>
  public class PlainTextSearchItem : SearchItemBase
  {
    public string SearchText { get; set; }

    public PlainTextSearchItem()
    {
    }

    public PlainTextSearchItem(string text)
    {
      DisplayText = SearchText = text;
    }

    public PlainTextSearchItem(string searchText, string displayText)
    {
      DisplayText = displayText;
      SearchText = searchText;
    }

    public override void FindProperties(PropertyDataSource dataSource,
      int pageNumber, Action<PropertyDataSourceResult> callback)
    {
      dataSource.FindProperties(SearchText, 1, callback);
    }
  }
}
