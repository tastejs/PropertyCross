using System;
using Cirrious.MvvmCross.Binding.BindingContext;
using Cirrious.MvvmCross.Touch.Views;
using MonoTouch.Foundation;
using MonoTouch.UIKit;
using PropertyCross.Core.ViewModels;

namespace PropertyCross.Touch.Views
{
    public partial class PropertyFinderViewController : MvxViewController
    {
        public PropertyFinderViewController()
            : base("PropertyFinderViewController", null)
        {
        }

        protected PropertyFinderViewController(IntPtr handle) : base(handle)
        {
        }

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();
            this.EdgesForExtendedLayout = UIRectEdge.None;
            Title = "PropertyCross";

            // set the back button text
            NavigationItem.BackBarButtonItem = new UIBarButtonItem("Search",
                UIBarButtonItemStyle.Bordered, BackButtonEventHandler);



            var favButton = new UIBarButtonItem("Favs",
                UIBarButtonItemStyle.Bordered, FavouriteButtonEventHandler);
            NavigationItem.RightBarButtonItem = favButton;

            var set = this.CreateBindingSet<PropertyFinderViewController, PropertyFinderViewModel>();
            set.Bind(favButton).To(vm => vm.ShowFavouritesCommand);

            set.Bind(userMessageLabel).To(vm => vm.Message);
            set.Bind(searchActivityIndicator).To(vm => vm.IsBusy).For("Hidden").WithConversion("Visibility");

            set.Bind(goButton).To(vm => vm.IsBusy).For("Enabled").WithConversion("Negated");
            set.Bind(goButton).To(vm => vm.SearchCommand);

            set.Bind(myLocationButton).To(vm => vm.IsBusy).For("Enabled").WithConversion("Negated");
            set.Bind(myLocationButton).To(vm => vm.UseLocationCommand);

            set.Bind(searchLocationText).To(vm => vm.SearchText);
            set.Bind(searchLocationText).To(vm => vm.IsBusy).For("Enabled").WithConversion("Negated");

            var recentSource = new TableViewSourceWithTitle(recentTableView, "Recent searches:",
                UITableViewCellStyle.Value1, new NSString("sub"),
                "TitleText Search.DisplayText; DetailText ResultsCount", UITableViewCellAccessory.DisclosureIndicator);
            recentTableView.Source = recentSource;
            set.Bind(recentTableView).To(vm => vm.ShowSelectLocation).For("Hidden").WithConversion("InvertedVisibility");
            set.Bind(recentSource).To(vm => vm.RecentSearches);
            set.Bind(recentSource).To(vm => vm.RecentSearchSelectedCommand).For(s => s.SelectionChangedCommand);

            recentTableView.SeparatorStyle = UITableViewCellSeparatorStyle.None;


            set.Bind(navigationTableView).To(vm => vm.ShowSelectLocation).For("Hidden").WithConversion("Visibility");
            var navigationSource = new TableViewSourceWithTitle(navigationTableView, "Select a location below:",
                UITableViewCellStyle.Default, new NSString("sub"), "TitleText DisplayName",
                UITableViewCellAccessory.DisclosureIndicator);
            navigationTableView.Source = navigationSource;
            set.Bind(navigationSource).To(vm => vm.SuggestedLocations);
            set.Bind(navigationSource).To(vm => vm.LocationSelectedCommand).For(s => s.SelectionChangedCommand);
            //set.Bind(navigationTableView).To(vm => vm.SuggestedLocations);
            navigationTableView.SeparatorStyle = UITableViewCellSeparatorStyle.None;



            set.Apply();
        }

        private void FavouriteButtonEventHandler(object sender, EventArgs args)
        {
        }

        private void BackButtonEventHandler(object sender, EventArgs args)
        {
            NavigationController.PopViewControllerAnimated(true);
        }

    }
}


