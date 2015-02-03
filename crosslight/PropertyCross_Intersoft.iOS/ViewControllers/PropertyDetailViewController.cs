using System;
using System.ComponentModel;

using CoreGraphics;
using Foundation;
using Intersoft.Crosslight;
using Intersoft.Crosslight.iOS;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using UIKit;

namespace PropertyCross_Intersoft.iOS
{
    [ImportBinding(typeof(PropertyDetailBindingProvider))]
    public partial class PropertyDetailViewController : UIViewController<PropertyDetailViewModel>
    {
        #region Constructors

        public PropertyDetailViewController()
            : base ("PropertyDetailView", null)
        {
        }

        #endregion

        #region Methods

        protected override void InitializeView()
        {
            base.InitializeView();

            this.ViewModel.Item.PropertyChanged += OnItemPropertyChanged;

            UIBarButtonItem favoriteButton = new UIBarButtonItem(UIImage.FromBundle("nostar.png"), UIBarButtonItemStyle.Plain, null);
            this.NavigationItem.SetRightBarButtonItem(favoriteButton, false);

            // Register Views
            this.NavigationItem.Title = "Property Details";
            this.RegisterViewIdentifier("FavoriteButton", favoriteButton);
            this.UpdateFavoriteIndicator();
        }

        private void OnItemPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsFavorite")
                this.UpdateFavoriteIndicator();
        }

        private void UpdateFavoriteIndicator()
        {
            if (this.ViewModel.Item.IsFavorite)
                this.NavigationItem.RightBarButtonItem.Image = UIImage.FromBundle("star.png");
            else
                this.NavigationItem.RightBarButtonItem.Image = UIImage.FromBundle("nostar.png");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.ViewModel.Item.PropertyChanged -= OnItemPropertyChanged;
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}

