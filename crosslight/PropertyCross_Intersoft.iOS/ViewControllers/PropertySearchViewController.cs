using Intersoft.Crosslight;
using Intersoft.Crosslight.iOS;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using UIKit;

namespace PropertyCross_Intersoft.iOS
{
    [ImportBinding(typeof(PropertySearchBindingProvider))]
    public class PropertySearchViewController : UIFormViewController<PropertySearchViewModel>
    {
        #region Constructors

        public PropertySearchViewController()
        {
            this.CancelButtonVisibility = CancelButtonVisibility.Never;
            this.DoneButtonVisibility = DoneButtonVisibility.Never;
        }

        protected override void InitializeView()
        {
            base.InitializeView();

            UIBarButtonItem showFavoriteButton = new UIBarButtonItem("Favs", UIBarButtonItemStyle.Plain, null);
            this.NavigationItem.SetRightBarButtonItem(showFavoriteButton, false);
            this.RegisterViewIdentifier("ShowFavoriteButton", showFavoriteButton);
        }

        #endregion
    }
}

