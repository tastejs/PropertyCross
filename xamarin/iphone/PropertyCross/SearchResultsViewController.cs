
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;

using PropertyCross.Model;
using PropertyCross.Presenter;
using System.Collections.Generic;
using MonoTouch.CoreFoundation;

namespace PropertyCross
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

      if (PlatformUtils.IsiOS7) {
        EdgesForExtendedLayout = UIRectEdge.None;
      }		

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
      _tableSource.SetProperties(properties, totalResult, searchLocation);
      searchResultsTable.ReloadData();

      Title = string.Format("{0:d} of {1:d} matches", properties.Count, totalResult);
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
        if (value == true && _tableSource.LoadingLabel != null)
        {
          _tableSource.LoadingLabel.Text = "Loading ...";
        }
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
      private UILabel _loadingLabel;
      private string _searchText;

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

      public UILabel LoadingLabel
      {
        get
        {
          return _loadingLabel;
        }
      }

      public void SetProperties (List<Property> properties, int totalResults, string searchText)
      {
        _properties = properties;
        _totalResults = totalResults;
        _searchText = searchText;
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
              if (cell.ImageView!=null) {
              cell.ImageView.Image = image;
              cell.SetNeedsLayout();
              }
            });
          });
        }
        else
        {
          _loadingLabel = cell.TextLabel;

          cell.TextLabel.Text = "Load more ...";

          UIFont boldFont = UIFont.BoldSystemFontOfSize(13.0f);
          UIFont regularFont = UIFont.SystemFontOfSize(13.0f);
          NSMutableDictionary regularFontAttributes =  new NSMutableDictionary() {{ UIStringAttributeKey.Font , regularFont }};
          NSMutableDictionary boldFontAttributes = new NSMutableDictionary() {{ UIStringAttributeKey.Font , boldFont}};
          
          string propertiesCountText = string.Format("{0:d}", _properties.Count);
          string totalResultsText = string.Format("{0:d}", _totalResults);
          
          // Create the attributed string
          string text = string.Format("Results for {0:s}, showing {1:d} of {2:d} properties",
                            _searchText, propertiesCountText, totalResultsText);
          NSMutableAttributedString attributedText = new NSMutableAttributedString(text, regularFontAttributes);
          
          // make certain components bold
          attributedText.SetAttributes(boldFontAttributes,
                                       new NSRange(12, _searchText.Length));
          attributedText.SetAttributes(boldFontAttributes,
                                       new NSRange(12 + _searchText.Length + 10, propertiesCountText.Length));
          attributedText.SetAttributes(boldFontAttributes,
                                       new NSRange(12 + _searchText.Length + 10 + propertiesCountText.Length + 4, totalResultsText.Length));
         
          cell.DetailTextLabel.AttributedText = attributedText;
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
        tableView.DeselectRow(indexPath, false);

        int row = indexPath.Row;
        if (row < _properties.Count)
        {
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

