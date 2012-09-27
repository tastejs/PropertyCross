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
using PropertyFinder.Presenter;
using PropertyFinder.Model;

namespace PropertyFinder
{
  public partial class FavouritesView : PhoneApplicationPage, FavouritesPresenter.View
  {
    public FavouritesView()
    {
      InitializeComponent();
    }

    protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
    {
      base.OnNavigatedTo(e);

      if (e.NavigationMode != NavigationMode.Back)
      {
        var presenter = App.Instance.CurrentPresenter as FavouritesPresenter;
        presenter.SetView(this);
      }
    }

    public void SetFavourites(List<Property> properties)
    {
      favouritesList.ItemsSource = properties;
    }

    public event EventHandler<PropertyEventArgs> PropertySelected = delegate { };

    private void FavouritesList_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
    {
      Property property = ((FrameworkElement)e.OriginalSource).DataContext as Property;
      if (property != null)
      {
        PropertySelected(this, new PropertyEventArgs(property));
      }
    }
  }
}