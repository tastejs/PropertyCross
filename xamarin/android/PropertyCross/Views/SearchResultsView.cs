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
using Com.Actionbarsherlock.App;
using Com.Actionbarsherlock.View;

using IMenuItem = global::Com.Actionbarsherlock.View.IMenuItem;
using Android.Text;
using Android.Graphics;

namespace com.propertycross.xamarin.android.Views
{
	[Activity (ScreenOrientation = ScreenOrientation.Portrait)]	
	public class SearchResultsView : SherlockListActivity, SearchResultsPresenter.View
	{
		private View footer;
		private TextView resultDetails;
		private SearchResultsPresenter presenter;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			SupportActionBar.SetDisplayHomeAsUpEnabled(true);

			LayoutInflater li = (LayoutInflater)GetSystemService(Context.LayoutInflaterService);
			footer = li.Inflate(Resource.Layout.load_more_footer, null);
			resultDetails = (TextView) footer.FindViewById(Resource.Id.result_details);
			footer.Click += OnFooterClicked;

			ListView.AddFooterView(footer);
			ListAdapter = new SearchResultsAdapter(this, new List<Property>() {});

			var app = PropertyFinderApplication.GetApplication(this);
			presenter = (SearchResultsPresenter) app.Presenter;
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

		public void SetSearchResults(int totalResult, int pageNumber, int totalPages,
        	List<Property> properties, string searchLocation)
        {
			// Format the text:
			// Results for x, showing y of z properties.
			String text = Java.Lang.String.Format(Resources.GetString(Resource.String.result_details),
			                                      searchLocation, properties.Count, totalResult);
			resultDetails.TextFormatted = Html.FromHtml (text);

			((SearchResultsAdapter) ListAdapter).AddRange(properties);
			SupportActionBar.Title = Java.Lang.String.Format(Resources.GetString(Resource.String.results_shown),
			                                                 properties.Count,
			                                                 totalResult);
        }
        
        public void SetLoadMoreVisible(bool visible)
        {
			/* List View footers cannot be hidden easily because they're wrapped
			 * in an enclosing View. Instead, remove the footer and add it back
			 * if necessary.
			 */
			ListView.RemoveFooterView(footer);
			if (visible)
			{
				ListView.AddFooterView(footer);
			}
        }

		public bool IsLoading
		{
			set
			{
				footer.Enabled = !value;
				if(value)
				{
					resultDetails.Text = Resources.GetString(Resource.String.loading);
				}
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