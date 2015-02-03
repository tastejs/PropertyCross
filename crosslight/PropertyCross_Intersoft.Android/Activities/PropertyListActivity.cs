using Android.App;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Android;
using Android.Content.PM;

namespace PropertyCross_Intersoft.Android
{
    [Activity(Label = "PropertyList",Icon = "@drawable/icon")]
    [ImportBinding(typeof(PropertyListBindingProvider))]
    public class PropertyListActivity : ListActivity<PropertyListViewModel>
    {      
        #region Properties

        public override ListViewInteraction InteractionMode
        {
            get { return ListViewInteraction.Navigation; }
        }

        protected override int ListItemLayoutId
        {
            get { return Resource.Layout.tablecellsubtitlewithimage; }
        }

        #endregion

        #region Methods

        protected override void InitializeView()
        {
            base.InitializeView();

            this.RegisterViewIdentifier("TableView", this.ListView);
        }

        #endregion
    }
}