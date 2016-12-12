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
    public class FavouritesView : MvxTableViewController
    {
        public override void ViewDidLoad()
        {
            base.ViewDidLoad();
            if (RespondsToSelector(new Selector("edgesForExtendedLayout")))
                EdgesForExtendedLayout = UIRectEdge.None;

            var source = new MvxStandardTableViewSource(TableView, UITableViewCellStyle.Subtitle, new NSString("sub"), "TitleText PriceText;ImageUrl ImageUri;DetailText DetailsText", UITableViewCellAccessory.DisclosureIndicator);
            TableView.Source = source;

            var set = this.CreateBindingSet<FavouritesView, FavouritesViewModel>();
            set.Bind(source).To(vm => vm.Properties);
            set.Bind(source).For(s => s.SelectionChangedCommand).To(vm => vm.FavouritesSelectedCommand);
            Title = "Favourites";
            

            set.Apply();

            TableView.ReloadData();
            
            
        }
     
      
    }

    
}