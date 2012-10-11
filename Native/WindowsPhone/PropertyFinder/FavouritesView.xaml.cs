using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Microsoft.Phone.Controls;
using System.Windows.Navigation;
using PropertyFinder.ViewModel;
using PropertyFinder.Model;

namespace PropertyFinder
{
  public partial class FavouritesView : PhoneApplicationPage
  {
    public FavouritesView()
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