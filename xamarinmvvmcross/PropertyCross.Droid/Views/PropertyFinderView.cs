using System;
using Android.App;
using Android.Content.PM;
using Android.OS;
using Android.Provider;
using Android.Views;
using Android.Views.InputMethods;
using Android.Widget;
using Cirrious.MvvmCross.Droid.Views;
using PropertyCross.Core.ViewModels;

namespace PropertyCross.Droid.Views
{
    [Activity(WindowSoftInputMode = SoftInput.StateHidden, ScreenOrientation = ScreenOrientation.Portrait)]
    public class PropertyFinderView : MvxActionBarBusyActivity, Android.Widget.TextView.IOnEditorActionListener
    {
        private PropertyFinderViewModel ViewModel
        {
            get
            {
                return base.ViewModel as PropertyFinderViewModel;
            }
        }
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            // Needs to be called before setting the content view
  
            SetContentView(Resource.Layout.PropertyFinderView);

            var searchText = (EditText)FindViewById(Resource.Id.search);
            searchText.SetOnEditorActionListener(this);                     
        }
        
        public override bool OnCreateOptionsMenu(IMenu menu)
        {
            MenuInflater.Inflate(Resource.Menu.menu_propertyfinderview, menu);

            return true;
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            switch (item.ItemId)
            {
                case Resource.Id.favourites_view_item:
                {
                    ViewModel.ShowFavouritesCommand.Execute(null);
                    return true;
                }
            }            
            return base.OnOptionsItemSelected(item);
        }

        

        public bool OnEditorAction(TextView v, ImeAction actionId, KeyEvent e)
        {
            if (actionId == ImeAction.Search)
            {
                ViewModel.SearchCommand.Execute(null);
                return true;
            }
            return false;
        }
    }
}