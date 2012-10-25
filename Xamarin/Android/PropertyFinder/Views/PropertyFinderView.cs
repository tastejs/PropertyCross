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
	[Activity (Label = "PropertyFinder", MainLauncher = true)]
	public class PropertyFinderView : Activity, PropertyFinderPresenter.View
	{
		private PropertyFinderPresenter presenter;
		private EditText searchText;
		private Button myLocationButton;
		private Button startSearchButton;
		private ListView recentSearchList;
		//private RecentSearchAdapter adapter;
		private ArrayAdapter<RecentSearch> adapter;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			var source = new PropertyDataSource(new JsonWebPropertySearch(new MarshalInvokeService()));
			var geoLocationService = new GeoLocationService((LocationManager)GetSystemService(Context.LocationService));
			var stateService = new StatePersistenceService(this);
			PropertyFinderPersistentState state = stateService.LoadState();

			SetContentView (Resource.Layout.PropertyFinderView);
			searchText = (EditText) FindViewById(Resource.Id.search);
			searchText.TextChanged += SearchText_Changed;

			myLocationButton = (Button) FindViewById(Resource.Id.use_location);
			myLocationButton.Click += LocationButton_Clicked; 

			startSearchButton = (Button) FindViewById (Resource.Id.do_search);
			startSearchButton.Click += StartSearchButton_Clicked;

			recentSearchList = (ListView) FindViewById (Resource.Id.recentsearches_list);
			recentSearchList.ItemClick += RecentSearchItem_Clicked;
			//adapter = new RecentSearchAdapter(this, new List<RecentSearch>());
			adapter = new ArrayAdapter<RecentSearch>(this, Android.Resource.Layout.SimpleListItem1, new List<RecentSearch>());
			recentSearchList.Adapter = adapter;

			presenter = 
				new PropertyFinderPresenter(state,
				                            source,
				                            new NavigationService(),
				                            geoLocationService);
			presenter.SetView(this);
		}

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			MenuInflater.Inflate(Resource.Menu.favourites_view, menu);
			return true;
		}

		public override bool OnOptionsItemSelected(IMenuItem item)
		{
			if(item.ItemId == Resource.Id.favourites_view_item)
			{
				FavouritesClicked(this, EventArgs.Empty);
				return true;
			}
			else
			{
				return base.OnOptionsItemSelected(item);
			}
		}

		public string SearchText
		{
			set { searchText.SetText(value, TextView.BufferType.Editable); }
		}

		public void SetMessage(string msg)
		{
		}

		public void DisplaySuggestedLocations (List<PropertyFinder.Model.Location> locations)
		{
		}

		public void DisplayRecentSearches(List<RecentSearch> recentSearches)
		{
			/*if(recentSearches == null)
			{
				adapter.SetData(new List<RecentSearch>());
			}
			else
			{
				adapter.SetData(recentSearches);
			}*/
		}

		public bool IsLoading
		{
			set
			{
				searchText.Enabled = !value;
				myLocationButton.Enabled = !value;
				startSearchButton.Enabled = !value;
			}
		}

		public event EventHandler SearchButtonClicked;
		public event EventHandler<SearchTextChangedEventArgs> SearchTextChanged;	
		public event EventHandler MyLocationButtonClicked;
		public event EventHandler FavouritesClicked;
		public event EventHandler<LocationSelectedEventArgs> LocationSelected;		
		public event EventHandler<RecentSearchSelectedEventArgs> RecentSearchSelected;

		private void SearchText_Changed(object sender, EventArgs e)
		{
			SearchTextChanged(this, new SearchTextChangedEventArgs(searchText.Text));
		}

		private void LocationButton_Clicked(object sender, EventArgs e)
		{
			MyLocationButtonClicked(this, EventArgs.Empty);
		}

		private void StartSearchButton_Clicked(object sender, EventArgs e)
		{
			SearchButtonClicked(this, EventArgs.Empty);
		}

		private void RecentSearchItem_Clicked(object sender, EventArgs e)
		{
			// todo - get recentsearch corresponding to position and fire recentsearchselected.
		}
	}
}
