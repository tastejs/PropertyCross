using System;

using Android.App;
using Android.Content;
using Android.Content.PM;
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
	[Activity (ScreenOrientation = ScreenOrientation.Portrait)]	
	public class SearchResultsView : ListActivity, SearchResultsPresenter.View
	{
		private View footer;
		private TextView resultDetails;
		private SearchResultsPresenter presenter;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			LayoutInflater li = (LayoutInflater)GetSystemService(Context.LayoutInflaterService);
			footer = li.Inflate(Resource.Layout.load_more_footer, null);
			resultDetails = (TextView) footer.FindViewById(Resource.Id.result_details);
			footer.Click += OnFooterClicked;

			ListView.AddFooterView(footer);
			ListAdapter = new SearchResultsAdapter(this, new List<Property>() {});

			var app = (PropertyFinderApplication)Application;
			presenter = (SearchResultsPresenter) app.Presenter;
			presenter.SetView(this);
			app.CurrentActivity = this;
		}

		public void SetSearchResults(int totalResult, int pageNumber, int totalPages,
        	List<Property> properties, string searchLocation)
        {
			resultDetails.Text = Java.Lang.String.Format(Resources.GetString(Resource.String.result_details),
			                                             searchLocation,
			                                             properties.Count,
			                                             totalResult);

			((SearchResultsAdapter) ListAdapter).AddRange(properties);
        }
        
        public void SetLoadMoreVisible(bool visible)
        {
			footer.Visibility = visible ? ViewStates.Visible : ViewStates.Invisible;
        }

		public bool IsLoading
		{
			set
			{
				footer.Enabled = !value;
			}
		}

      	public event EventHandler LoadMoreClicked;
      	public event EventHandler<PropertyEventArgs> PropertySelected;

		protected override void OnListItemClick(ListView l, View v, int position, long id)
		{
			var adapter = (SearchResultsAdapter) ListAdapter;
			Property item = adapter[position];
			PropertySelected(this, new PropertyEventArgs(item));
		}

		private void OnFooterClicked(object sender, EventArgs e)
		{
			LoadMoreClicked(this, EventArgs.Empty);
		}
	}
}	