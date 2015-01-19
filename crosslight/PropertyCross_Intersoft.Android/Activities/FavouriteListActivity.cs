using Android.App;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Android;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;

namespace PropertyCross_Intersoft.Android
{
    [Activity(Label = "Favourite Property List", Icon = "@drawable/icon")]
    [ImportBinding(typeof(FavouriteListBindingProvider))]
    public class FavouriteListActivity : ListActivity<FavouriteListViewModel>
    {
        #region Properties

        public override EditingOptions EditingOptions
        {
            get { return EditingOptions.AllowEditing | EditingOptions.AllowMultipleSelection; }
        }

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