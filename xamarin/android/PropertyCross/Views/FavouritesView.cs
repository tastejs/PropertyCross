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
using PropertyFinder.Presenter;
using PropertyFinder.Model;
using Com.Actionbarsherlock.App;
using Com.Actionbarsherlock.View;

using IMenuItem = global::Com.Actionbarsherlock.View.IMenuItem;

namespace com.propertycross.xamarin.android.Views
{
	[Activity (ScreenOrientation = ScreenOrientation.Portrait)]			
	public class FavouritesView : SherlockListActivity, FavouritesPresenter.View
	{		
		private FavouritesPresenter presenter;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			SupportActionBar.Title = Resources.GetString(Resource.String.favourites_view);
			SupportActionBar.SetDisplayHomeAsUpEnabled(true);

			ListAdapter = new SearchResultsAdapter(this, new List<Property>() {});
			
			var app = (PropertyFinderApplication)Application;
			presenter = (FavouritesPresenter) app.Presenter;
			presenter.SetView(this);
			app.CurrentActivity = this;
		}

		public override bool OnOptionsItemSelected(IMenuItem item)
		{
			if(item.ItemId == Android.Resource.Id.Home)
			{
				Finish();
				return true;
			}
			return base.OnOptionsItemSelected(item);
		}

		protected override void OnListItemClick(ListView l, View v, int position, long id)
		{
			var adapter = (SearchResultsAdapter) ListAdapter;
			Property item = adapter[position];
			PropertySelected(this, new PropertyEventArgs(item));
		}

		public void SetFavourites(List<Property> properties)
		{
			ListAdapter = new SearchResultsAdapter(this, properties);
		}
		
		public event EventHandler<PropertyEventArgs> PropertySelected;
	}
}

