using System;
using Microsoft.Phone.Controls;
using PropertyFinder.ViewModel;
using System.Windows.Navigation;
using PropertyFinder.Model;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Input;
using System.Collections.ObjectModel;

namespace PropertyFinder
{
  public partial class SearchResultsView : PhoneApplicationPage
  {
    public SearchResultsView()
    {
      InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
      base.OnNavigatedTo(e);

      if (e.NavigationMode != NavigationMode.Back)
      {
        DataContext = App.Instance.CurrentViewModel;
      }
    }

  }
}