
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

    private UIBarButtonItem _favouriteButton;

    public PropertyViewController (PropertyPresenter presenter) : base ("PropertyViewController", null)
    {
      Title = "Property";
      _presenter = presenter;

      _favouriteButton = new UIBarButtonItem("+",
            UIBarButtonItemStyle.Bordered, FavouriteButtonEventHandler);
    }
		
    public override void ViewDidLoad ()
    {
      base.ViewDidLoad ();

      NavigationItem.RightBarButtonItem = _favouriteButton;

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
        _favouriteButton.Title = value ? "-" : "+";
      }
    }

    #endregion

    private void FavouriteButtonEventHandler (object sender, EventArgs args)
    {
      ToggleFavourite(this, EventArgs.Empty);
    }

  }
}

