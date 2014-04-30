using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Cirrious.MvvmCross.Binding.BindingContext;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.ViewModels;
using PropertyCross.Droid.MvvmCross;

namespace PropertyCross.Droid.Views
{
    [Activity(ScreenOrientation = ScreenOrientation.Portrait)]				

    public class PropertyView : MvxActionBarActivity
    {
        private bool _isFavourited;

        public new PropertyViewModel ViewModel
        {
            get
            {
                return (PropertyViewModel) base.ViewModel;
            }
        }


        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            SetContentView(Resource.Layout.PropertyView);
            SupportActionBar.Title = Resources.GetString(Resource.String.property_title);

            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
           
            var set = this.CreateBindingSet<PropertyView, PropertyViewModel>();
            set.Bind(this).For(prop => prop.IsFavourited).To(vm => vm.IsFavourited).OneWay();
            set.Apply();


        }
        public override bool OnCreateOptionsMenu(IMenu menu)
        {
            MenuInflater.Inflate(Resource.Menu.favourites_toggle, menu);
            return true;
        }
        public override bool OnPrepareOptionsMenu(IMenu menu)
        {
            IMenuItem addItem = menu.FindItem(Resource.Id.favourites_add_item);

            addItem.SetVisible(!IsFavourited);

            IMenuItem removeItem = menu.FindItem(Resource.Id.favourites_remove_item);
            removeItem.SetVisible(IsFavourited);
            return true;
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            if (item.ItemId == Android.Resource.Id.Home)
            {
                Finish();
                return true;
            }

            if ((item.ItemId == Resource.Id.favourites_add_item && !IsFavourited) ||
               (item.ItemId == Resource.Id.favourites_remove_item && IsFavourited))
            {
                ViewModel.ToggleIsFavouriteCommand.Execute(null);
                return true;
            }
            else
            {
                return base.OnOptionsItemSelected(item);
            }
        }

        public bool IsFavourited
        {
            get { return _isFavourited; }
            set
            {
                _isFavourited = value; 
                InvalidateOptionsMenu();
            }
        }
    }
}