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
using Android.Support.V4.App;

namespace PropertyFinder.Views
{
	[Activity (MainLauncher = true, WindowSoftInputMode = SoftInput.StateHidden, ScreenOrientation = ScreenOrientation.Portrait)]
	public class PropertyFinderView : Activity, PropertyFinderPresenter.View
	{
		private PropertyFinderPresenter presenter;
		private EditText searchText;
		private Button myLocationButton;
		private Button startSearchButton;
		private TextView messageText;
		private ListView recentSearchList;
		private RecentSearchAdapter adapter;
		private View mainView;
		private ProgressBar progress;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			var app = (PropertyFinderApplication)Application;

			var source = new PropertyDataSource(new JsonWebPropertySearch(new MarshalInvokeService(app)));
			var geoLocationService = new GeoLocationService((LocationManager)GetSystemService(Context.LocationService));
			var stateService = new StatePersistenceService(app);
			PropertyFinderPersistentState state = stateService.LoadState();

			SetContentView (Resource.Layout.PropertyFinderView);
			searchText = (EditText) FindViewById(Resource.Id.search);
			searchText.TextChanged += SearchText_Changed;

			myLocationButton = (Button) FindViewById(Resource.Id.use_location);
			myLocationButton.Click += LocationButton_Clicked; 

			startSearchButton = (Button) FindViewById(Resource.Id.do_search);
			startSearchButton.Click += StartSearchButton_Clicked;

			messageText = (TextView) FindViewById(Resource.Id.mainview_message);

			recentSearchList = (ListView) FindViewById(Resource.Id.recentsearches_list);
			recentSearchList.ItemClick += RecentSearchItem_Clicked;
			adapter = new RecentSearchAdapter(this, new List<RecentSearch>());
			recentSearchList.Adapter = adapter;

			progress = (ProgressBar) FindViewById(Resource.Id.progress);
			progress.Visibility = ViewStates.Invisible;
			mainView = FindViewById(Resource.Id.propview);

			presenter = 
				new PropertyFinderPresenter(state,
				                            source,
				                            new NavigationService(app),
				                            geoLocationService);
			presenter.SetView(this);

			app.Presenter = presenter;
			app.CurrentActivity = this;
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
			messageText.Text = msg;
		}

		public void DisplaySuggestedLocations (List<PropertyFinder.Model.Location> locations)
		{
		}

		public void DisplayRecentSearches(List<RecentSearch> recentSearches)
		{
			if(recentSearches != null)
			{
				adapter = new RecentSearchAdapter(this, recentSearches);
				recentSearchList.Adapter = adapter;
			}
		}

		public bool IsLoading
		{
			set
			{
				searchText.Enabled = !value;
				myLocationButton.Enabled = !value;
				startSearchButton.Enabled = !value;
				progress.Visibility = value ? ViewStates.Visible : ViewStates.Invisible;
				mainView.Visibility = !value ? ViewStates.Visible : ViewStates.Invisible;
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

		private void RecentSearchItem_Clicked(object sender, AdapterView.ItemClickEventArgs e)
		{
			RecentSearch item = adapter.GetItem(e.Position);
			RecentSearchSelected(this, new RecentSearchSelectedEventArgs(item));
		}
	}
}
