
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;

using PropertyFinder.Model;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
  public partial class PropertyViewController : UIViewController, PropertyPresenter.View
  {
    private PropertyPresenter _presenter;

    public PropertyViewController (PropertyPresenter presenter) : base ("PropertyViewController", null)
    {
      Title = "Property";
      _presenter = presenter;
    }
		
		
    public override void ViewDidLoad ()
    {
      base.ViewDidLoad ();

      _presenter.SetView(this);
    }
		
    public override void ViewDidUnload ()
    {
      base.ViewDidUnload ();
      ReleaseDesignerOutlets ();
    }
		
    public override bool ShouldAutorotateToInterfaceOrientation (UIInterfaceOrientation toInterfaceOrientation)
    {
      return (toInterfaceOrientation != UIInterfaceOrientation.PortraitUpsideDown);
    }

    #region View implementation

    public event EventHandler ToggleFavourite = delegate {};

    public void SetProperty (Property property)
    {
      priceLabel.Text = property.FormattedPrice;
      titleLabel.Text = property.ShortTitle;
      descriptionLabel.Text = property.Summary;
      descriptionLabel.SizeToFit();
      bedBathroomLabel.Text = property.BedBathroomText;
      imageView.Image = UIImage.LoadFromData (NSData.FromUrl (new NSUrl (property.ImageUrl)));

    }

    public bool IsFavourited {
      set
      {

      }
    }

    #endregion



  }
}

