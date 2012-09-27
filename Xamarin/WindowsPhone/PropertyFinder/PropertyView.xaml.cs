using System;
using System.Windows.Media;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using PropertyFinder.Converter;
using PropertyFinder.Model;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
  public partial class PropertyView : PhoneApplicationPage, PropertyPresenter.View
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
        var presenter = App.Instance.CurrentPresenter as PropertyPresenter;
        presenter.SetView(this);
      }
    }

    public void SetProperty(Property property)
    {
      propertyTitle.Text = property.ShortTitle;
      propertyPrice.Text = property.FormattedPrice;
      propertyDescription.Text = property.Summary;
      propertyDetails.Text = property.BedBathroomText;
      propertyImage.Source = _conv.Convert(property.ImageUrl, null, null, null) as ImageSource;
    }

    public event EventHandler ToggleFavourite = delegate { };

    private void ApplicationBarIconButton_Click(object sender, EventArgs e)
    {
      ToggleFavourite(this, EventArgs.Empty);
    }

    public bool IsFavourited
    {
      set
      {
        var btn = (ApplicationBarIconButton)ApplicationBar.Buttons[0];
        btn.IconUri = new Uri(value ? "/Images/favourited.png" : "/Images/addToFavourites.png", UriKind.Relative);
        btn.Text = value ? "remove favourite" : "add favourite";
      }
    }
  }
}