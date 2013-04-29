using System;
using System.Linq;
using System.Collections.Generic;
using PropertyFinder.Model;
using System.Collections.ObjectModel;
using System.Windows.Input;
using System.Windows;

namespace PropertyFinder.ViewModel
{
  /// <summary>
  /// A presenter which renders a collection of search results.
  /// </summary>
  public class SearchResultsViewModel : ViewModelBase
  {
    private INavigationService _navigationService;
    
    private SearchItemBase _searchItem;

    private int _pageNumber = 1;

    private PropertyDataSource _dataSource;

    private ObservableCollection<PropertyViewModel> _properties;

    private int _totalResult;

    private int _totalPages;

    private bool _isLoading = false;

    private bool _loadMoreVisible = true;

    private PropertyFinderPersistentState _state;

    public SearchResultsViewModel(INavigationService navigationService, PropertyFinderPersistentState state,
      PropertyListingsResult results, SearchItemBase searchItem, PropertyDataSource dataSource)
    {
      _state = state;
      _navigationService = navigationService;
      _searchItem = searchItem;
      _dataSource = dataSource;
      var propertyViewModels = results.Data.Select(p => new PropertyViewModel(this, state, p)).ToList();
      _properties = new ObservableCollection<PropertyViewModel>(propertyViewModels);
      _totalResult = results.TotalResult;
      _totalPages = results.TotalPages;
      UpdateLoadMoreVisible();
    }

    public string SearchText
    {
      get { return _searchItem.DisplayText; }
    }

    public ObservableCollection<PropertyViewModel> Properties
    {
      get { return _properties; }
    }

    public int TotalPages
    {
      get { return _totalPages; }
    }

    public int TotalResults
    {
      get { return _totalResult; }
    }

    public bool LoadMoreVisible
    {
      get { return _loadMoreVisible; }
      set
      {
        SetField<bool>(ref _loadMoreVisible, value, "LoadMoreVisible");
      }
    }

    private void UpdateLoadMoreVisible()
    {
      LoadMoreVisible = Properties.Count < TotalResults;
    }

    public bool IsLoading
    {
      get { return _isLoading; }
      set
      {
        SetField<bool>(ref _isLoading, value, "IsLoading");
      }
    }

    public int PageNumber
    {
      get { return _pageNumber; }
      set
      {
        SetField<int>(ref _pageNumber, value, "PageNumber");
      }
    }

    public ICommand LoadMoreCommand
    {
      get
      {
        return new DelegateCommand(() => LoadMore());
      }
    }

    public ICommand PropertySelectedCommand
    {
      get
      {
        return new DelegateCommand<PropertyViewModel>(property => PropertySelected(property));
      }
    }

    private void PropertySelected(PropertyViewModel property)
    {
      _navigationService.PushViewModel(property);
    }

    private void LoadMore()
    {
      PageNumber++;
      IsLoading = true;

      _searchItem.FindProperties(_dataSource, _pageNumber, response =>
      {
        if (response is PropertyListingsResult)
        {
          foreach(var property in ((PropertyListingsResult)response).Data)
          {
            Properties.Add(new PropertyViewModel(this, _state, property));
          }
          UpdateLoadMoreVisible();
          IsLoading = false;
        }
      }, error =>
      {
        IsLoading = false;
      });
    }
  }
}
