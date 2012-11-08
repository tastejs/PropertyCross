using System;
using System.Windows.Media;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using PropertyFinder.Converter;
using PropertyFinder.Model;
using PropertyFinder.ViewModel;
using System.ComponentModel;

namespace PropertyFinder
{
  public partial class PropertyView : PhoneApplicationPage
  {
    private UrlToImageSourceConverter _conv = new UrlToImageSourceConverter();
    
    public PropertyView()
    {
      InitializeComponent();
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
      base.OnNavigatedTo(e);

      if (e.NavigationMode != NavigationMode.Back)
      {
        DataContext = App.Instance.CurrentViewModel;
        UpdateButtonState();
        ViewModel.PropertyChanged += ViewModel_PropertyChanged;
      }
    }

    private PropertyViewModel ViewModel
    {
      get { return (PropertyViewModel)DataContext; }
    }

    private void ViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
    {
      if (e.PropertyName == "IsFavourited")
      {
        UpdateButtonState();
      }
    }

    private void UpdateButtonState()
    {
      var btn = (ApplicationBarIconButton)ApplicationBar.Buttons[0];
      btn.IconUri = new Uri(ViewModel.IsFavourited ? "/Images/favourited.png" : "/Images/addToFavourites.png", UriKind.Relative);
      btn.Text = ViewModel.IsFavourited ? "remove favourite" : "add favourite";
    }

    private void ApplicationBarIconButton_Click(object sender, EventArgs e)
    {
      ViewModel.IsFavourited = !ViewModel.IsFavourited;
    }
  }
}