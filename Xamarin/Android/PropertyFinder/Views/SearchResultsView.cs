using System;

using Android.App;
using Android.Content;
using Android.Locations;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using PropertyFinder.Presenter;
using System.Collections.Generic;
using PropertyFinder.Model;

namespace PropertyFinder.Views
{
	[Activity]
	public class SearchResultsView : ListActivity, SearchResultsPresenter.View
	{
		private View footer;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			LayoutInflater li = (LayoutInflater)GetSystemService(Context.LayoutInflaterService);
			footer = li.Inflate(Resource.Layout.loadmore, null);

			ListView.AddFooterView(footer);
			ListAdapter = new SearchResultsAdapter(this, new List<Property>() {});
		}

		public void SetSearchResults(int totalResult, int pageNumber, int totalPages,
        	List<Property> properties, string searchLocation)
        {
        }
        
        public void SetLoadMoreVisible(bool visible)
        {
			footer.Visibility = visible ? ViewStates.Visible : ViewStates.Invisible;
        }

		private bool _loading;
		public bool IsLoading
		{
			set
			{
				_loading = value;
			}
		}

      	public event EventHandler LoadMoreClicked;
      	public event EventHandler<PropertyEventArgs> PropertySelected;

		protected override void OnListItemClick(ListView l, View v, int position, long id)
		{
			var adapter = (SearchResultsAdapter) ListAdapter;
			Property item = adapter.GetItem(position);
			PropertySelected(this, new PropertyEventArgs(item));
		}
	}
}	