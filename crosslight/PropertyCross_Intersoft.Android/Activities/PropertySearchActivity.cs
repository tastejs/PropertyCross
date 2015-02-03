using Android.App;
using Intersoft.Crosslight.Android;
using Intersoft.Crosslight;
using PropertyCross_Intersoft.ViewModels;
using PropertyCross_Intersoft.Core;

namespace PropertyCross_Intersoft.Android
{
    [Activity(Label = "PropertyCross", Icon = "@drawable/icon")]
    [ImportBinding(typeof(PropertySearchBindingProvider))]
    public class PropertySearchActivity : FormActivity<PropertySearchViewModel>
    {
        #region Properties

        protected override bool ShowActionBarUpButton
        {
            get { return true; }
        }

        protected override int MenuLayoutId
        {
            get { return Resource.Layout.actionbareditinglayout; }
        }

        #endregion
    }
}

