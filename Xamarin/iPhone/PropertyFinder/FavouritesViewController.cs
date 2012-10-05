
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;
using PropertyFinder.Presenter;
using PropertyFinder.Model;
using System.Collections.Generic;

namespace PropertyFinder
{
  public partial class FavouritesViewController : UIViewController, FavouritesPresenter.View
  {
    private FavouritesPresenter _presenter;

    private PropertiesTableSource _propertiesTableSource = new PropertiesTableSource();

    public FavouritesViewController (FavouritesPresenter presenter) : base ("FavouritesViewController", null)
    {
      Title = "Favourites";

      _presenter = presenter;
    }
		
    public override void DidReceiveMemoryWarning ()
    {
      // Releases the view if it doesn't have a superview.
      base.DidReceiveMemoryWarning ();
			
      // Release any cached data, images, etc that aren't in use.
    }
		
    public override void ViewDidLoad ()
    {
      base.ViewDidLoad ();
			
      tableView.Source = _propertiesTableSource;

      _propertiesTableSource.ItemSelected += (sender, e) => 
        PropertySelected(this, new PropertyEventArgs(e.Item));

      _presenter.SetView(this);
    }
		
    public override void ViewDidUnload ()
    {
      base.ViewDidUnload ();
			
      ReleaseDesignerOutlets ();
    }
		
    public override bool ShouldAutorotateToInterfaceOrientation (UIInterfaceOrientation toInterfaceOrientation)
    {
      // Return true for supported orientations
      return (toInterfaceOrientation != UIInterfaceOrientation.PortraitUpsideDown);
    }

    #region View implementation

    public event EventHandler<PropertyEventArgs> PropertySelected = delegate {};

    public void SetFavourites (List<Property> properties)
    {
      _propertiesTableSource.SetItems(properties);
      tableView.ReloadData();
    }

    #endregion

    private class PropertiesTableSource : TableSourceBase<Property>
    {
      public PropertiesTableSource() : base(UITableViewCellStyle.Subtitle)
      {
      }

      #region implemented abstract members of TableSourceBase

      public override void ConfigureCell (UITableViewCell cell, Property property)
      {
        cell.TextLabel.Text = property.FormattedPrice;
        cell.DetailTextLabel.Text = property.Title;
        cell.Accessory = UITableViewCellAccessory.DisclosureIndicator;
        cell.ImageView.Image = UIImage.LoadFromData (NSData.FromUrl (new NSUrl (property.ThumbnailUrl)));
      }
      #endregion

      public override float GetHeightForRow (UITableView tableView, NSIndexPath indexPath)
      {
        return 70;
      }
    }
  }
}

