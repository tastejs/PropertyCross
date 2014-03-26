using System;
using Cirrious.CrossCore.WeakSubscription;
using Cirrious.MvvmCross.Binding.BindingContext;
using Cirrious.MvvmCross.Binding.Touch.Views;
using Cirrious.MvvmCross.Touch.Views;
using MonoTouch.UIKit;
using PropertyCross.Core.ViewModels;

namespace PropertyCross.Touch.Views
{
    public partial class PropertyView : MvxViewController
    {
        public PropertyView()
            : base("PropertyViewController", null)
        {

            _imageViewLoader = new MvxImageViewLoader(() => this.imageView);



            _starImage = new UIImage("star.png");
            _noStarImage = new UIImage("nostar.png");

            _favouriteButton = new UIBarButtonItem(_starImage,
                  UIBarButtonItemStyle.Bordered, FavouriteButtonEventHandler);

        }


        private readonly MvxImageViewLoader _imageViewLoader;
        private UIBarButtonItem _favouriteButton;
        private UIImage _starImage;
        private UIImage _noStarImage;

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();

            NavigationItem.RightBarButtonItem =_favouriteButton ;
            UpdateFavouriteIcon();

            Title = "Property Details";




            this.EdgesForExtendedLayout = UIRectEdge.None;

            var set = this.CreateBindingSet<PropertyView, PropertyViewModel>();
            set.Bind(priceLabel).To(vm => vm.PriceText);
            set.Bind(titleLabel).To(vm => vm.Location);
            set.Bind(bedBathroomLabel).To(vm => vm.PropertyOverview);
            set.Bind(descriptionLabel).To(vm => vm.PropertyInformation);
            set.Bind(_imageViewLoader).To(vm => vm.ImageUri);
            set.Bind(_favouriteButton).To(vm => vm.ToggleIsFavouriteCommand);


            set.Apply();
           ViewModel.WeakSubscribe(PropertyUpdated);
        }

        private void PropertyUpdated(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsFavourited")
            {
                UpdateFavouriteIcon();

            }
        }

        private void UpdateFavouriteIcon()
        {
            _favouriteButton.Image = ViewModel.IsFavourited ? _starImage : _noStarImage;
        }

        private void FavouriteButtonEventHandler(object sender, EventArgs args)
        {
        }

        private void BackButtonEventHandler(object sender, EventArgs args)
        {
            NavigationController.PopViewControllerAnimated(true);
        }


        private new PropertyViewModel ViewModel
        {
            get
            {
                return ((PropertyViewModel)base.ViewModel);
            }
        }

    }
}



