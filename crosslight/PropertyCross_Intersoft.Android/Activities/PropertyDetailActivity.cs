using Android.App;
using Android.OS;
using Android.Views;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Android;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Android
{
    [Activity(Label = "Property Detail", Icon = "@drawable/icon")]
    [ImportBinding(typeof(PropertyDetailBindingProvider))]
    public class PropertyDetailActivity : Activity<PropertyDetailViewModel>
    {
        #region Fields

        private IMenu _menu;

        #endregion

        #region Properties

        protected override int ContentLayoutId
        {
            get { return Resource.Layout.propertydetail; }
        }

        protected override bool ShowActionBarUpButton
        {
            get { return true; }
        }

        protected override int MenuLayoutId
        {
            get { return Resource.Layout.actionbardetail; }
        }

        #endregion

        #region Methods

        public override bool OnCreateOptionsMenu(IMenu menu)
        {
            _menu = menu;

            // update the favorite indicator initially
            var isCreateMenu = base.OnCreateOptionsMenu(menu);
            if (isCreateMenu)
                this.UpdateFavoriteIndicator();

            return isCreateMenu;
        }

        protected override void OnViewCreated()
        {
            base.OnViewCreated();

            if (this.ViewModel != null)
                this.ViewModel.Item.PropertyChanged += OnItemPropertyChanged;
        }

        private void OnItemPropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsFavorite")
                this.UpdateFavoriteIndicator();
        }

        protected override void OnDestroy()
        {
            if (this.ViewModel != null)
                this.ViewModel.Item.PropertyChanged -= OnItemPropertyChanged;

            base.OnDestroy();
        }

        private void UpdateFavoriteIndicator()
        {
            if (this.ViewModel.Item.IsFavorite)
                _menu.FindItem(Resource.Id.FavoriteButton).SetIcon(Resource.Drawable.star);
            else
                _menu.FindItem(Resource.Id.FavoriteButton).SetIcon(Resource.Drawable.nostar);
        }

        #endregion
    }
}

