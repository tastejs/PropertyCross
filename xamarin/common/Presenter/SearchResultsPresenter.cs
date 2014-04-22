using System;
using System.Collections.Generic;
using PropertyCross.Model;

namespace PropertyCross.Presenter
{
  /// <summary>
  /// A presenter which renders a collection of search results.
  /// </summary>
  public class SearchResultsPresenter
  {
    /// <summary>
    /// The interface this presenter requires from the assocaited view.
    /// </summary>
    public interface View
    {
      /// <summary>
      /// Supplies the search results and meta-data.
      /// </summary>
      void SetSearchResults(int totalResult, int pageNumber, int totalPages,
        List<Property> properties, string searchLocation);

      /// <summary>
      /// Sets whether a 'load more' button should be displayed
      /// </summary>
      void SetLoadMoreVisible(bool visible);

      /// <summary>
      /// Sets whether to display a loading indicator.
      /// </summary>
      bool IsLoading { set; }

      event EventHandler LoadMoreClicked;

      event EventHandler<PropertyEventArgs> PropertySelected;
    }

    private View _view;
    
    private INavigationService _navigationService;
    
    private SearchItemBase _searchItem;

    private int _pageNumber = 1;

    private PropertyDataSource _dataSource;

    private List<Property> _properties;

    private int _totalResult;

    private int _totalPages;

    private PropertyCrossPersistentState _state;

    public SearchResultsPresenter(INavigationService navigationService, PropertyCrossPersistentState state,
      PropertyListingsResult results, SearchItemBase searchItem, PropertyDataSource dataSource)
    {
      _state = state;
      _navigationService = navigationService;
      _searchItem = searchItem;
      _dataSource = dataSource;
      _properties = results.Data;
      _totalResult = results.TotalResult;
      _totalPages = results.TotalPages;
    }

    public void SetView(View view)
    {
      _view = view;
      _view.LoadMoreClicked += View_LoadMoreClicked;
      _view.PropertySelected += View_PropertySelected;

      view.SetSearchResults(_totalResult, _pageNumber, _totalPages, _properties, _searchItem.DisplayText);
      view.SetLoadMoreVisible(_pageNumber < _totalPages);
    }

    private void View_PropertySelected(object sender, PropertyEventArgs e)
    {
      var presenter = new PropertyPresenter(_state, e.Property);
      _navigationService.PushPresenter(presenter);
    }

    private void View_LoadMoreClicked(object sender, EventArgs e)
    {
      _pageNumber++;
      _view.IsLoading = true;

      _searchItem.FindProperties(_dataSource, _pageNumber, response =>
      {
        if (response is PropertyListingsResult)
        {
          _properties.AddRange(((PropertyListingsResult)response).Data);
          _view.SetSearchResults(_totalResult, _pageNumber, _totalPages, _properties, _searchItem.DisplayText);
          _view.SetLoadMoreVisible(_pageNumber < _totalPages);
          _view.IsLoading = false;
        }
      }, error =>
      {
        _view.IsLoading = false;
      });
    }
  }
}
