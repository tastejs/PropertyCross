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
	public class SearchResultsView : Activity, SearchResultsPresenter.View
	{
		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);
		}

		public void SetSearchResults(int totalResult, int pageNumber, int totalPages,
        	List<Property> properties, string searchLocation)
        {
        }
        
        public void SetLoadMoreVisible(bool visible)
        {
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
	}
}	