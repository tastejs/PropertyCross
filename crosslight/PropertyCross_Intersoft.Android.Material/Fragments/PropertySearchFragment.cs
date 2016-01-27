using Android.Runtime;
using Android.Views;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Android.v7;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using System;

namespace PropertyCross_Intersoft.Android.Material
{
    [ImportBinding(typeof(PropertySearchBindingProvider))]
    public class PropertySearchFragment : FormFragment<PropertySearchViewModel>
    {
        #region Constructors

        public PropertySearchFragment()
            : base()
        {
        }

        public PropertySearchFragment(IntPtr javaReference, JniHandleOwnership transfer)
            : base(javaReference, transfer)
        {
        }

        #endregion

        #region Methods

        protected override void Initialize()
        {
            base.Initialize();

            this.IconId = Resource.Drawable.ic_toolbar;
            this.AddBarItem(new BarItem("ShowFavoriteButton", "Favorites") { ShowAsAction = ShowAsAction.Always });
        }

        #endregion
    }
}

