using System;
using PropertyFinder.ViewModel;
using Microsoft.Phone.Controls;
using PropertyFinder.Model;
using System.Collections.Generic;
using System.Windows.Input;
using System.Windows;
using System.Windows.Navigation;
using System.Windows.Controls;

namespace PropertyFinder
{
  public partial class PropertyFinderView : PhoneApplicationPage
  {
    // Constructor
    public PropertyFinderView()
    {
      InitializeComponent();
    }

    private PropertyFinderViewModel ViewModel
    {
      get { return ((PropertyFinderViewModel)DataContext); }
    }

    private void ApplicationBarIconButton_Click(object sender, EventArgs e)
    {
      ViewModel.FavouritesSelectedCommand.Execute(null);
    }

    private void TextBox_KeyDown(object sender, KeyEventArgs e)
    {
      if (e.Key == Key.Enter)
      {
        ViewModel.SearchCommand.Execute(null);
      }
    }

  }
}