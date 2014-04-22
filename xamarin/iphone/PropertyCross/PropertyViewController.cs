
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;

using PropertyCross.Model;
using PropertyCross.Presenter;

namespace PropertyCross
{
  public partial class PropertyViewController : UIViewController, PropertyPresenter.View
  {
    private PropertyPresenter _presenter;

    private UIBarButtonItem _favouriteButton;

    private UIImage _starImage;

    private UIImage _noStarImage;

    public PropertyViewController (PropertyPresenter presenter) : base ("PropertyViewController", null)
    {
      Title = "Property Details";
      _presenter = presenter;

      _starImage = new UIImage("star.png");
      _noStarImage = new UIImage("nostar.png");

      _favouriteButton = new UIBarButtonItem(_starImage,
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
        _favouriteButton.Image = value ? _starImage : _noStarImage;
      }
    }

    #endregion

    private void FavouriteButtonEventHandler (object sender, EventArgs args)
    {
      ToggleFavourite(this, EventArgs.Empty);
    }

  }
}

