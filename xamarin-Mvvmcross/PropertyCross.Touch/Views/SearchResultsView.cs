using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using Cirrious.CrossCore.WeakSubscription;
using Cirrious.MvvmCross.Binding.Bindings;
using Cirrious.MvvmCross.Binding.Touch.Views;
using Cirrious.MvvmCross.Touch.Views;
using MonoTouch.Foundation;
using MonoTouch.ObjCRuntime;
using MonoTouch.UIKit;
using Cirrious.MvvmCross.Binding.BindingContext;
using PropertyCross.Core.ViewModels;

namespace PropertyCross.Touch.Views
{
    public class SearchResultsView :MvxTableViewController
    {
        public override void ViewDidLoad()
        {
            base.ViewDidLoad();
            if (RespondsToSelector(new Selector("edgesForExtendedLayout")))
                EdgesForExtendedLayout = UIRectEdge.None;

            var source = new MvxStandardTableViewSource(TableView, UITableViewCellStyle.Subtitle, new NSString("sub"), "TitleText PriceText;ImageUrl ImageUri;DetailText DetailsText", UITableViewCellAccessory.DisclosureIndicator);
            TableView.Source = source;

            var set = this.CreateBindingSet<SearchResultsView, SearchResultsViewModel>();
            set.Bind(source).To(vm => vm.Properties);
            set.Bind(source).For(s => s.SelectionChangedCommand).To(vm => vm.PropertiesSelectedCommand);
            set.Bind(this).For(s => s.Title).To(vm => vm.Title);
            var myFooter = new UIView(new RectangleF(0, 0, 320, 40));

            UIButton loadMoreButton = new UIButton(new RectangleF(0, 0, 320, 40));
            loadMoreButton.SetTitle("Load More", UIControlState.Normal);
            loadMoreButton.SetTitleColor(UIColor.Black, UIControlState.Normal);
            set.Bind(loadMoreButton).To(vm => vm.LoadMoreCommand);          
            set.Bind(loadMoreButton).For("Title").To(vm => vm.Title);

            myFooter.Add(loadMoreButton);

            
            TableView.TableFooterView = myFooter;


            set.Apply();

            TableView.ReloadData();
            ViewModel.WeakSubscribe(PropertyChanged);

            NavigationItem.BackBarButtonItem = new UIBarButtonItem("Results",
                         UIBarButtonItemStyle.Bordered, BackButtonEventHandler);
        }
        private void BackButtonEventHandler(object sender, EventArgs args)
        {
            NavigationController.PopViewControllerAnimated(true);
        }

        private new SearchResultsViewModel ViewModel
        {
            get
            {
                return ((SearchResultsViewModel) base.ViewModel);
            }
        }

        private void PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsMoreAvailable")
            {
                if (!ViewModel.IsMoreAvailable)
                {
                    TableView.TableFooterView = null;
                }
            }
        }

      
    }

    
}