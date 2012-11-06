
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using PropertyFinder.Presenter;
using PropertyFinder.Model;

namespace PropertyFinder
{
	[Activity]			
	public class FavouritesView : ListActivity, FavouritesPresenter.View
	{		
		private FavouritesPresenter presenter;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			ListAdapter = new SearchResultsAdapter(this, new List<Property>() {});
			
			var app = (PropertyFinderApplication)Application;
			presenter = (FavouritesPresenter) app.Presenter;
			presenter.SetView(this);
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

