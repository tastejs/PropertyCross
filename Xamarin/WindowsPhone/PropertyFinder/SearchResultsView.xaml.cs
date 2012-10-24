using System;
using Microsoft.Phone.Controls;
using PropertyFinder.Presenter;
using System.Windows.Navigation;
using PropertyFinder.Model;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Input;
using System.Collections.ObjectModel;

namespace PropertyFinder
{
  public partial class SearchResultsView : PhoneApplicationPage, SearchResultsPresenter.View
  {
    private ObservableCollection<Property> _properties = new ObservableCollection<Property>();

    public SearchResultsView()
    {
      InitializeComponent();

      list.ItemsSource = _properties;
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
      base.OnNavigatedTo(e);

      if (e.NavigationMode != NavigationMode.Back)
      {
        var presenter = App.Instance.CurrentPresenter as SearchResultsPresenter;
        presenter.SetView(this);
      }
    }

    private void LoadMore_Click(object sender, RoutedEventArgs e)
    {
      LoadMoreClicked(this, EventArgs.Empty);
    }

    public void SetLoadMoreVisible(bool visible)
    {
      loadMoreButton.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
    }

    public event EventHandler LoadMoreClicked = delegate { };

    public event EventHandler<PropertyEventArgs> PropertySelected = delegate { };

    public void SetSearchResults(int totalResult, int pageNumber, int totalPages,
      List<Property> properties, string searchLocation)
    {
      _properties.Clear();
      foreach (var property in properties)
      {
        _properties.Add(property);
      }
      searchText.Text = searchLocation;
      propertiesShown.Text = properties.Count.ToString();
      totalProperties.Text = totalResult.ToString();
      this.pageNumber.Text = pageNumber.ToString();
      this.totalPages.Text = totalPages.ToString();
    }

    public void AddSearchResults(int pageNumber, List<Property> properties)
    {
      this.pageNumber.Text = pageNumber.ToString();

      foreach (var property in properties)
      {
        _properties.Add(property);
      }
    }

    public bool IsLoading
    {
      set
      {
        loadMoreButton.IsEnabled = !value;
        loadingIndicator.Visibility = value ? Visibility.Visible : Visibility.Collapsed;
      }
    }

    private void PropertyList_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
    {
      Property property = ((FrameworkElement)e.OriginalSource).DataContext as Property;
      if (property != null)
      {
        PropertySelected(this, new PropertyEventArgs(property));
      }
    }

  }
}