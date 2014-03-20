using System;
using System.Collections.Generic;
using Cirrious.MvvmCross.Binding.Bindings;
using Cirrious.MvvmCross.Binding.Touch.Views;
using MonoTouch.Foundation;
using MonoTouch.UIKit;

namespace PropertyCross.Touch.Views
{
    public class TableViewSourceWithTitle : MvxStandardTableViewSource
    {
        private readonly string _title;

        public TableViewSourceWithTitle(UITableView tableView, string title) : base(tableView)
        {
            _title = title;
        }

        public TableViewSourceWithTitle(UITableView tableView, string title, NSString cellIdentifier)
            : base(tableView, cellIdentifier)
        {
            _title = title;
        }

        public TableViewSourceWithTitle(UITableView tableView, string title, string bindingText)
            : base(tableView, bindingText)
        {
            _title = title;
        }

        public TableViewSourceWithTitle(IntPtr handle) : base(handle)
        {
        }

        public TableViewSourceWithTitle(UITableView tableView, string title, UITableViewCellStyle style, NSString cellIdentifier, string bindingText, UITableViewCellAccessory tableViewCellAccessory = UITableViewCellAccessory.None)
            : base(tableView, style, cellIdentifier, bindingText, tableViewCellAccessory)
        {
            _title = title;
        }

        public TableViewSourceWithTitle(UITableView tableView, UITableViewCellStyle style, NSString cellIdentifier, IEnumerable<MvxBindingDescription> descriptions, UITableViewCellAccessory tableViewCellAccessory = UITableViewCellAccessory.None) : base(tableView, style, cellIdentifier, descriptions, tableViewCellAccessory)
        {
        }

        public override string TitleForHeader(UITableView tableView, int section)
        {
            return _title;
        }
    }
}