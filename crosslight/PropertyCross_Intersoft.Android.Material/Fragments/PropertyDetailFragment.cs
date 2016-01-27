using Android.Views;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Android.v7;
using Intersoft.Crosslight.Android.v7.ComponentModels;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using Android.Transitions;

namespace PropertyCross_Intersoft.Android.Material
{
    [ImportBinding(typeof(PropertyDetailBindingProvider))]
    public class PropertyDetailFragment : Intersoft.Crosslight.Android.v7.Fragment<PropertyDetailViewModel>
    {
        #region Fields

        private IMenu _menu;

        #endregion

        #region Properties

        protected override int ContentLayoutId
        {
            get { return Resource.Layout.item_detail; }
        }

        protected override bool ShowActionBarUpButton
        {
            get { return true; }
        }

        #endregion

        #region Methods

        protected override void Initialize()
        {
            base.Initialize();

            this.ToolbarSettings.Mode = ToolbarMode.Collapsing;
            this.ToolbarSettings.CollapsingToolbarSettings.EnableParallaxImage = true;
            this.ToolbarSettings.CollapsingToolbarSettings.ExpandedHeight = 240;

            // Defines floating action button.
            this.FloatingActionButtons.Add(new FloatingActionButton("FavoriteButton")
            {
                Position = FloatingActionButtonPosition.BottomRight,
                IconId = Resource.Drawable.star,
                Direction = FloatingActionButtonDirection.Up,
                AnchorId = Resource.Id.app_bar_layout
            });

            if (this.Activity.IsApiLevel21())
            {
                this.EnterTransition = new Slide();
                this.ReturnTransition = new Fade();
                this.ReenterTransition = new Fade();
            }

            this.TargetSharedElementIds.Add(Resource.Id.parallax_image);
        }

        public override void OnPrepareOptionsMenu(IMenu menu)
        {
            base.OnPrepareOptionsMenu(menu);

            _menu = menu;
            
            this.UpdateFavoriteIndicator();
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

        public override void OnDestroy()
        {
            if (this.ViewModel != null)
                this.ViewModel.Item.PropertyChanged -= OnItemPropertyChanged;

            base.OnDestroy();
        }

        private void UpdateFavoriteIndicator()
        {
            if (this.FloatingActionButtons[0] != null)
            {
                if (this.ViewModel.Item.IsFavorite)
                    this.FloatingActionButtons[0].View.SetImageResource(Resource.Drawable.star);
                else
                    this.FloatingActionButtons[0].View.SetImageResource(Resource.Drawable.nostar);
            }
        }

        #endregion
    }
}

