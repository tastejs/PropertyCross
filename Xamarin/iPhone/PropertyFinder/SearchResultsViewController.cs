
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;

using PropertyFinder.Model;
using PropertyFinder.Presenter;
using System.Collections.Generic;
using MonoTouch.CoreFoundation;

namespace PropertyFinder
{
  public partial class SearchResultsViewController : UIViewController, SearchResultsPresenter.View
  {
    private SearchResultsPresenter _presenter;

    private TableSource _tableSource;

    public SearchResultsViewController (SearchResultsPresenter presenter)
      : base ("SearchResultsViewController", null)
    {
      Title = "Results";

      _presenter = presenter;
    }
		
    public override void DidReceiveMemoryWarning ()
    {
      base.DidReceiveMemoryWarning ();
    }
		
    public override void ViewDidLoad ()
    {
      base.ViewDidLoad ();			

      // configure the UITableView
      _tableSource = new TableSource();
      _tableSource.PropertySelected += (s,e) => PropertySelected(this, e);
      _tableSource.LoadMore += (s, e) => LoadMoreClicked(this, e);
      searchResultsTable.Source = _tableSource;

      _presenter.SetView(this);

      // set the back button text
      NavigationItem.BackBarButtonItem = new UIBarButtonItem("Results",
                           UIBarButtonItemStyle.Bordered, BackButtonEventHandler);
    }

    private void BackButtonEventHandler (object sender, EventArgs args)
    {
      NavigationController.PopViewControllerAnimated(true);
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

    public event EventHandler LoadMoreClicked  = delegate{};

    public event EventHandler<PropertyEventArgs> PropertySelected = delegate{};

    public void SetSearchResults (int totalResult, int pageNumber, int totalPages,
                                                       List<Property> properties, string searchLocation)
    {
      _tableSource.SetProperties(properties, totalResult);
      searchResultsTable.ReloadData();

      Title = string.Format("{0:d} of {1:d} results", properties.Count, totalResult);
    }

    public void SetLoadMoreVisible (bool visible)
    {
      _tableSource.LoadMoreVisible = visible;
      searchResultsTable.ReloadData();
    }

    public bool IsLoading
    {
      set
      {
       
      }
    }

    #endregion

    /// <summary>
    /// A table source implementation that renders a list of properties
    /// and optionally a load-more indicator.
    /// </summary>
    public class TableSource : UITableViewSource
    {
      private bool _loadMoreVisible = false;
      private List<Property> _properties = new List<Property>();
      private static readonly string _cellIdentifier = "TableCell";
      private int _totalResults;

      public TableSource ()
      {
      }

      public bool LoadMoreVisible
      {
        set
        {
          _loadMoreVisible = value;
        }
      }

      public void SetProperties (List<Property> properties, int totalResults)
      {
        _properties = properties;
        _totalResults = totalResults;
      }

      public override int RowsInSection (UITableView tableview, int section)
      {
        return _properties.Count + (_loadMoreVisible ? 1 : 0);
      }

      public override UITableViewCell GetCell (UITableView tableView, MonoTouch.Foundation.NSIndexPath indexPath)
      {
        UITableViewCell cell = tableView.DequeueReusableCell (_cellIdentifier);
        if (cell == null) {
          cell = new UITableViewCell (UITableViewCellStyle.Subtitle, _cellIdentifier);
        }

        int row = indexPath.Row;
        if (row < _properties.Count)
        {
          var property = _properties [indexPath.Row];
          cell.TextLabel.Text = property.FormattedPrice;
          cell.DetailTextLabel.Text = property.Title;
          cell.Accessory = UITableViewCellAccessory.DisclosureIndicator;
          cell.ImageView.Frame = new RectangleF(cell.ImageView.Frame.Location, new SizeF(60,60));

          DispatchQueue.DefaultGlobalQueue.DispatchAsync(() => {
            UIImage image = UIImage.LoadFromData (NSData.FromUrl (new NSUrl (property.ThumbnailUrl)));
            DispatchQueue.MainQueue.DispatchAsync(() => {
              cell.ImageView.Image = image;
              cell.SetNeedsLayout();
            });
          });
        }
        else
        {
          cell.TextLabel.Text = "Load more ...";
          cell.DetailTextLabel.Text = string.Format("Showing {0:d} of {1:d} matches", _properties.Count, _totalResults);
          cell.ImageView.Image = null;
        }
        return cell;
      }

      public override float GetHeightForRow (UITableView tableView, NSIndexPath indexPath)
      {
        return 70;
      }

      public override void RowSelected (UITableView tableView, NSIndexPath indexPath)
      {
        int row = indexPath.Row;
        if (row < _properties.Count)
        {
          tableView.DeselectRow(indexPath, false);
          var property = _properties [row];
          PropertySelected (this, new PropertyEventArgs (property));
        }
        else
        {
          LoadMore(this, EventArgs.Empty);
        }
      }

      public event EventHandler<PropertyEventArgs> PropertySelected = delegate{};

      public event EventHandler LoadMore = delegate{};
    }
  }
}

