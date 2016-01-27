using Intersoft.Crosslight;
using Intersoft.Crosslight.Android;
using Intersoft.Crosslight.Android.v7;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Android.Material
{
    [ImportBinding(typeof(PropertyListBindingProvider))]
    public class PropertyListFragment : RecyclerViewFragment<PropertyListViewModel>
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
            
            this.ImageLoaderSettings.AnimateOnLoad = true;
            this.InteractionMode = ListViewInteraction.Navigation;
            this.SourceSharedElementIds.Add(Resource.Id.ImageView);
        }

        #endregion
    }
}