using Intersoft.Crosslight;
using Intersoft.Crosslight.Android;
using Intersoft.Crosslight.Android.v7;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Android.Material
{
    [ImportBinding(typeof(FavouriteListBindingProvider))]
    public class FavouriteListFragment : RecyclerViewFragment<FavouriteListViewModel>
    {
        #region Properties

        protected override int ItemLayoutId
        {
            get { return Resource.Layout.item_layout; }
        }

        protected override bool ShowActionBarUpButton
        {
            get
            {
                return true;
            }
        }

        #endregion

        #region Methods

        protected override void Initialize()
        {
            base.Initialize();

            this.InteractionMode = ListViewInteraction.Navigation;
            this.EditingOptions = EditingOptions.AllowEditing;
            this.SourceSharedElementIds.Add(Resource.Id.ImageView);
        }

        #endregion
    }
}