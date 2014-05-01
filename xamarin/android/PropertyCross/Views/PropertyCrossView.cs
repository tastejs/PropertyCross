using System;

using System.Collections.Generic;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

using PropertyCross.Presenter;
using PropertyCross.Model;

using Com.Actionbarsherlock.App;
using Com.Actionbarsherlock.View;

using IMenu = global::Com.Actionbarsherlock.View.IMenu;
using IMenuItem = global::Com.Actionbarsherlock.View.IMenuItem;
using MenuItem = global::Com.Actionbarsherlock.View.MenuItem;
using MenuInflater = global::Com.Actionbarsherlock.View.MenuInflater;
using Android.Views.InputMethods;
using Android.Views.Animations;

namespace com.propertycross.xamarin.android.Views
{
	[Activity (MainLauncher = true, WindowSoftInputMode = SoftInput.StateHidden, ScreenOrientation = ScreenOrientation.Portrait)]
	public class PropertyCrossView : SherlockActivity, PropertyCrossPresenter.View, Android.Widget.TextView.IOnEditorActionListener
	{
		private PropertyCrossPresenter presenter;
		private EditText searchText;
		private Button myLocationButton;
		private Button startSearchButton;
		private TextView messageText;
		private TextView resultsHeader;
		private ListView resultsList;
		private GeoLocationService geoLocationService;
		private bool showingRecentSearches = true;
		private IMenuItem refreshItem;
		private ImageView loadingView;
		private Animation loadingAnimation;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			var app = PropertyCrossApplication.GetApplication(this);
			app.CurrentActivity = this;

			var uiMarshal = new MarshalInvokeService(app);
			var source = new PropertyDataSource(new JsonWebPropertySearch(uiMarshal));
			geoLocationService = new GeoLocationService((Android.Locations.LocationManager)GetSystemService(Context.LocationService), uiMarshal);
			var stateService = new StatePersistenceService(app);
			PropertyCrossPersistentState state = stateService.LoadState();

			SetContentView (Resource.Layout.PropertyCrossView);
			searchText = (EditText) FindViewById(Resource.Id.search);
			searchText.TextChanged += SearchText_Changed;
			searchText.SetOnEditorActionListener(this);

			myLocationButton = (Button) FindViewById(Resource.Id.use_location);
			myLocationButton.Click += LocationButton_Clicked; 

			startSearchButton = (Button) FindViewById(Resource.Id.do_search);
			startSearchButton.Click += StartSearchButton_Clicked;

			messageText = (TextView) FindViewById(Resource.Id.mainview_message);

			resultsHeader = (TextView) FindViewById(Resource.Id.results_header);
			resultsList = (ListView) FindViewById(Resource.Id.results_list);
			resultsList.ItemClick += ResultsListItem_Clicked;
			resultsList.Adapter = new RecentSearchAdapter(this, new List<RecentSearch>());

			loadingAnimation = AnimationUtils.LoadAnimation(this, Resource.Animation.loading_rotate);
			loadingAnimation.RepeatMode = RepeatMode.Restart;

			presenter = 
				new PropertyCrossPresenter(state,
				                            source,
				                            new NavigationService(app),
				                            geoLocationService);
			presenter.SetView(this);

			app.Presenter = presenter;
		}

		protected override void OnPause()
		{
			base.OnPause();
			geoLocationService.Unsubscribe();
		}

		protected override void OnDestroy()
		{
			base.OnDestroy();
			geoLocationService.Dispose();
		}

		public override bool OnPrepareOptionsMenu(IMenu menu)
		{
			refreshItem = menu.FindItem(Resource.Id.refresh);
			loadingView = (ImageView) refreshItem.ActionView;
			return true;
		}

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			SupportMenuInflater.Inflate(Resource.Menu.menu_propertycrossview, menu);
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
			// Ignore null messages from the presenter.
			if (msg != null)
			{
				messageText.Text = msg;
			}
		}

		public void DisplaySuggestedLocations (List<Location> locations)
		{
			if(locations != null)
			{
				showLocations();
				resultsList.Adapter = new AmbiguousLocationsAdapter(this, locations);;
			}
		}

		public void DisplayRecentSearches(List<RecentSearch> recentSearches)
		{
			if(recentSearches != null)
			{
				showRecentSearches();
				resultsList.Adapter = new RecentSearchAdapter(this, recentSearches);
			}
		}

		private void showRecentSearches()
		{
			showingRecentSearches = true;
			resultsHeader.Text = Resources.GetString(Resource.String.recent_searches);
		}
		
		private void showLocations()
		{
			showingRecentSearches = false;
			resultsHeader.Text = Resources.GetString(Resource.String.ambiguous_location);
		}

		public bool IsLoading
		{
			set
			{
				searchText.Enabled = !value;
				myLocationButton.Enabled = !value;
				startSearchButton.Enabled = !value;

				if (value)
				{
					loadingView.StartAnimation(loadingAnimation);
					refreshItem.SetVisible(true);
				}
				else
				{
					loadingView.ClearAnimation();
					refreshItem.SetVisible(false);
				}
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
			String searchTerm = searchText.Text;
			if (searchTerm != null)
			{
				searchTerm = searchTerm.Trim();
				SearchTextChanged(this, new SearchTextChangedEventArgs(searchTerm));
			}
		}

		public bool OnEditorAction (TextView v, ImeAction actionId, KeyEvent e)
		{
			if (actionId == ImeAction.Search)
			{
				SearchButtonClicked(this, EventArgs.Empty);
				return true;
			}
			return false;
		}

		private void LocationButton_Clicked(object sender, EventArgs e)
		{
			MyLocationButtonClicked(this, EventArgs.Empty);
		}

		private void StartSearchButton_Clicked(object sender, EventArgs e)
		{
			SearchButtonClicked(this, EventArgs.Empty);
		}

		private void ResultsListItem_Clicked(object sender, AdapterView.ItemClickEventArgs e)
		{
			if(showingRecentSearches)
			{
				RecentSearchAdapter adapter = (RecentSearchAdapter) resultsList.Adapter;
				RecentSearch item = adapter.GetItem(e.Position);
				RecentSearchSelected(this, new RecentSearchSelectedEventArgs(item));
			}
			else
			{
				AmbiguousLocationsAdapter adapter = (AmbiguousLocationsAdapter) resultsList.Adapter;
				Location item = adapter.GetItem(e.Position);
				LocationSelected(this, new LocationSelectedEventArgs(item));
			}
		}
	}
}
