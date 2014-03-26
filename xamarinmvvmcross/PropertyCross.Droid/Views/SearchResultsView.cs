using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Cirrious.MvvmCross.Binding.BindingContext;
using Cirrious.MvvmCross.Binding.Droid.Views;
using PropertyCross.Core.ViewModels;
using PropertyCross.Droid.MvvmCross;

namespace PropertyCross.Droid.Views
{
    [Activity(ScreenOrientation = ScreenOrientation.Portrait)]	
    public class SearchResultsView : MvxActionBarBusyActivity
    {
        public new SearchResultsViewModel ViewModel
        {
            get
            {
                return (SearchResultsViewModel) base.ViewModel;
            }
        }
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            //SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            ActionBar ab = ActionBar;
            ab.SetDisplayHomeAsUpEnabled(true);

            SetContentView(Resource.Layout.SearchResultView);

            var set = this.CreateBindingSet<SearchResultsView, SearchResultsViewModel>();
            set.Bind(this).For(prop => prop.Title).To(vm => vm.Title).OneWay();
            set.Apply();

            MvxListView list = FindViewById<MvxListView>(Resource.Id.ListView);
            list.Scroll += list_Scroll;

        }

        void list_Scroll(object sender, AbsListView.ScrollEventArgs e)
        {
            if (e.FirstVisibleItem + e.VisibleItemCount == e.TotalItemCount)
            {
                if (ViewModel.IsMoreAvailable && !ViewModel.IsBusy)
                {
                    ViewModel.LoadMoreCommand.Execute(null);
                }
            }
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            if (item.ItemId == Android.Resource.Id.Home)
            {
                Finish();
                return true;
            }
            return base.OnOptionsItemSelected(item);
        }


    }
}