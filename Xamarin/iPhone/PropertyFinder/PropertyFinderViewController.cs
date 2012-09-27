
using System;
using System.Drawing;

using MonoTouch.Foundation;
using MonoTouch.UIKit;
using MonoTouch.CoreGraphics;

using PropertyFinder.Model;
using PropertyFinder.Presenter;
using System.Collections.Generic;

namespace PropertyFinder
{
  public partial class PropertyFinderViewController : UIViewController, PropertyFinderPresenter.View
  {
    private PropertyFinderPresenter _presenter;

    private LocationsTableSource _locationsTableSource;

    private RecentSearchesTableSource _recentTableSource;

    public PropertyFinderViewController (PropertyFinderPresenter presenter)
      : base ("PropertyFinderViewController", null)
    {
      Title = "Property Finder";

      _presenter = presenter;
    }

    public override void ViewDidLoad ()
    {
      base.ViewDidLoad ();

      // initial UI state
      searchActivityIndicator.Hidden = true;
      tableView.Hidden = true;
      tableView.SeparatorColor = UIColor.Clear;

      // handle teh enter key, hiding teh keyboard and initiating a search
      var enterDelegate = new CatchEnterDelegate();
      enterDelegate.EnterClicked += (s, e) => SearchButtonClicked(this, e);
      searchLocationText.Delegate = enterDelegate;

      // set the back button text
      NavigationItem.BackBarButtonItem = new UIBarButtonItem("Search",
                           UIBarButtonItemStyle.Bordered, BackButtonEventHandler);

      // configure the table sources
      _locationsTableSource = new LocationsTableSource();
      _locationsTableSource.ItemSelected += (sender, e) =>
        {
          LocationSelected(this,new LocationSelectedEventArgs(e.Item));
      };

      _recentTableSource = new RecentSearchesTableSource();
      _recentTableSource.ItemSelected += (s,e) =>
        {
          RecentSearchSelected(this, new RecentSearchSelectedEventArgs(e.Item));
      };

      tableView.BackgroundColor = UIColor.Clear;

      // associate with the presenter
      _presenter.SetView (this);
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

    #region PropertyFinderPresenter.View implementation 
    public string SearchText
    {
      set
      {
        searchLocationText.Text = value;
      }
    }

    public event EventHandler SearchButtonClicked = delegate { };

    public event EventHandler MyLocationButtonClicked = delegate { };

    public event EventHandler<LocationSelectedEventArgs> LocationSelected = delegate { };

    public event EventHandler<RecentSearchSelectedEventArgs> RecentSearchSelected = delegate { };

    public event EventHandler FavouritesClicked = delegate { };

    public event EventHandler<SearchTextChangedEventArgs> SearchTextChanged = delegate { };

    public void DisplayRecentSearches(List<RecentSearch> recentSearches)
    {
      if (recentSearches == null)
      {
        tableView.Hidden = true;
      }
      else
      {
        tableView.Hidden = false;

        _recentTableSource.SetItems (recentSearches);
        tableView.Source = _recentTableSource;
        tableView.ReloadData ();
      }
    }

    public void DisplaySuggestedLocations (List<Location> locations)
    {
      if (locations == null)
      {
        tableView.Hidden = true;
      }
      else
      {
        tableView.Hidden = false;

        _locationsTableSource.SetItems (locations);
        tableView.Source = _locationsTableSource;
        tableView.ReloadData ();
      }
    }

    public void SetMessage (string message)
    {
      userMessageLabel.Text = message;

      if (string.IsNullOrEmpty (message)) {
        tableView.Transform = CGAffineTransform.MakeIdentity ();
      } else {
        tableView.Transform = CGAffineTransform.MakeTranslation(0, 100);
      }
    }

    public bool IsLoading
    {
      set
      {
        searchActivityIndicator.Hidden = !value;
        if (value)
        {
          searchActivityIndicator.StartAnimating();
        }
        else
        {
          searchActivityIndicator.StopAnimating();
        }
        goButton.Enabled = !value;
        myLocationButton.Enabled = !value;
        searchLocationText.Enabled = !value;
      }
    }

    #endregion

    partial void goButtonTouched (NSObject sender)
    {
      // hide the keyboard
      searchLocationText.ResignFirstResponder();

      SearchButtonClicked(this, EventArgs.Empty);
    }

    partial void searchLocationTextChanged (NSObject sender)
    {
      SearchTextChanged(this, new SearchTextChangedEventArgs(searchLocationText.Text));
    }

    public class CatchEnterDelegate : UITextFieldDelegate
    {
      public override bool ShouldReturn (UITextField textField)
      {
        textField.ResignFirstResponder ();
        EnterClicked(this, EventArgs.Empty);
        return true;
      }

      public event EventHandler EnterClicked = delegate {};
    }

    public abstract class TableSourceBase<T> : UITableViewSource
    {
      private List<T> _items = new List<T>();
      private static readonly string _cellIdentifier = "TableCell";
      private UITableViewCellStyle _cellStyle;
      
      public TableSourceBase (UITableViewCellStyle cellStyle)
      {
        _cellStyle = cellStyle;
      }

      
      public void SetItems (List<T> items)
      {
        _items = items;
      }
      
      public override int RowsInSection (UITableView tableview, int section)
      {
        return _items.Count;
      }
      
      public override UITableViewCell GetCell (UITableView tableView, MonoTouch.Foundation.NSIndexPath indexPath)
      {
        UITableViewCell cell = tableView.DequeueReusableCell (_cellIdentifier);
        if (cell == null) {
          cell = new UITableViewCell (_cellStyle, _cellIdentifier);
        }
        T item = _items [indexPath.Row];
        ConfigureCell(cell, item);
        return cell;
      }

      public abstract void ConfigureCell (UITableViewCell cell, T item);
      
      public override void WillDisplay (UITableView tableView, UITableViewCell cell, NSIndexPath indexPath)
      {
        cell.TextLabel.Font = UIFont.SystemFontOfSize(UIFont.SystemFontSize);
      }
      
      public override float GetHeightForRow (UITableView tableView, NSIndexPath indexPath)
      {
        return 30;
      }
      
      public override void RowSelected (UITableView tableView, NSIndexPath indexPath)
      {
        T item = _items [indexPath.Row];
        ItemSelected(this, new ItemSelectedEventArgs<T>(item));
      }

      public event EventHandler<ItemSelectedEventArgs<T>> ItemSelected = delegate { };
    }

    public class ItemSelectedEventArgs<T> : EventArgs
    {
      public T Item { get; private set; }
      
      public ItemSelectedEventArgs(T item)
      {
        Item = item;
      }
    }

    public class LocationsTableSource : TableSourceBase<Location>
    {
      public LocationsTableSource () : base(UITableViewCellStyle.Value1)
      {
      }

      public override string TitleForHeader (UITableView tableView, int section)
      {
        return "Select a location below:";
      }

      public override void ConfigureCell (UITableViewCell cell, Location location)
      {
        cell.TextLabel.Text = location.DisplayName;
        cell.Accessory = UITableViewCellAccessory.DisclosureIndicator;
      }
    }

    public class RecentSearchesTableSource : TableSourceBase<RecentSearch>
    {
      private List<RecentSearch> _recent = new List<RecentSearch>();
      private static readonly string _cellIdentifier = "TableCell";

      public RecentSearchesTableSource () : base(UITableViewCellStyle.Default)
      {
      }

      public override string TitleForHeader (UITableView tableView, int section)
      {
        return _recent.Count > 0 ? "Recent searches:" : "";
      }

      public override void ConfigureCell (UITableViewCell cell, RecentSearch recentSearch)
      {
        cell.TextLabel.Text = string.Format ("{0:s} ({1:d})", recentSearch.Search.DisplayText, recentSearch.ResultsCount);
        cell.Accessory = UITableViewCellAccessory.DisclosureIndicator;
      }
    }
  }
}



