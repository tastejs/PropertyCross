using System;
using MonoTouch.UIKit;
using System.Collections.Generic;
using MonoTouch.Foundation;

namespace PropertyFinder
{
  /// <summary>
  /// A base class which provides a generic UITableViewSource implementation
  /// for UITableViews that render an array of typed objects.
  /// </summary>
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

    /// <summary>
    /// Implemented by subclasses in order to configure the cell state as it renders the given item.
    /// </summary>
    public abstract void ConfigureCell (UITableViewCell cell, T item);

    /// <summary>
    /// Occurs when an item is selcted.
    /// </summary>
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

}

