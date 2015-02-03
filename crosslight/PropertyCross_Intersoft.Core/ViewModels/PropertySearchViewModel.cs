using System;
using System.Linq;
using System.Threading.Tasks;
using Intersoft.AppFramework;
using Intersoft.AppFramework.Models;
using Intersoft.AppFramework.ModelServices;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Data.ComponentModel;
using Intersoft.Crosslight.Input;
using Intersoft.Crosslight.Mobile;
using Intersoft.Crosslight.ViewModels;
using PropertyCross_Intersoft.Models;
using PropertyCross_Intersoft.ModelServices;

namespace PropertyCross_Intersoft.ViewModels
{
    public class PropertySearchViewModel : EditorViewModelBase<Search>
    {
        #region Constructors

        public PropertySearchViewModel()
        { 
            this.Repository = new PropertyRepository();
            this.LocalRepository = new LocalDataRepository();
            this.SearchCommand = new DelegateCommand(ExecuteSearch);
            this.SearchMyLocationCommand = new DelegateCommand(ExecuteSearchFromMyLocation);
            this.ShowFavoriteCommand = new DelegateCommand(ExecuteShowFavorite);
        }

        #endregion

        #region Commands

        public DelegateCommand SearchMyLocationCommand { get; set; }

        public DelegateCommand SearchCommand { get; set; }

        public DelegateCommand ShowFavoriteCommand { get; set; }

        #endregion

        #region Properties

        protected PropertyRepository Repository { get; set; }

        protected LocalDataRepository LocalRepository { get; set; }

        public override Type FormMetadataType
        {
            get { return typeof(Search.FormMetadata); }
        }

        #endregion

        #region Methods

        private void ExecuteShowFavorite(object parameter)
        {
            this.NavigationService.Navigate<FavouriteListViewModel>();
        }

        private void ExecuteSearch(object parameter)
        {
            if (string.IsNullOrEmpty(this.Item.Location))
            {
                this.MessagePresenter.Show("Please enter a location to search.");
                return;
            }

            this.LoadData();
        }

        private async void ExecuteSearchFromMyLocation(object parameter)
        {
            try
            {
                this.ActivityPresenter.Show("Getting your location...", ActivityStyle.SmallIndicatorWithText);

                // get current location
                var locationResult = await this.MobileService.Location.GetCurrentLocationAsync(LocationAccuracy.Kilometer);

                // set coordinate to current item
                this.Item.Coordinate = locationResult.Location.Coordinate.Longitude + "," + locationResult.Location.Coordinate.Latitude;
                this.Item.Location = this.Item.Coordinate;

                // perform search
                this.LoadData();
            }
            catch (Exception ex)
            {
                this.MessagePresenter.Show(ex.Message, "Search Failed");
            }
            finally
            {
                this.ActivityPresenter.Hide();
            }
        }

        protected virtual async void LoadData()
        {
            try
            {
                this.ActivityPresenter.Show("Searching...", ActivityStyle.SmallIndicatorWithText);

                QueryDescriptor queryDescriptor = new QueryDescriptor();
                queryDescriptor.FilterDescriptors.Add(new FilterDescriptor("Location", FilterOperator.IsEqualTo, this.Item.Location));
                queryDescriptor.PageDescriptor.PageIndex = 0;
         
                SelectParameter selectParameter = new SelectParameter();
                selectParameter.QueryDescriptor = queryDescriptor;
                
                ISelectResult<Property> selectResult = await this.Repository.GetAllAsync(selectParameter);
                SearchResult searchResult = new SearchResult();
                searchResult.Items = selectResult;
                searchResult.Location = this.Item.Location;

                if (selectResult.ItemCount == 0)
                {
                    this.MessagePresenter.Show("No listing found near " + this.Item.Location);
                }
                else
                {
                    this.Item.ItemCount = selectResult.ItemCount;
                    this.SaveRecentSearch();
                    this.ShowSearchResult(searchResult);
                }
            }
            catch (Exception ex)
            {
                this.MessagePresenter.Show(ex.Message, "Search Failed");
            }
            finally
            {
                this.ActivityPresenter.Hide();
            }
        }

        public override void Navigated(NavigatedParameter parameter)
        {
            Search search = new Search();
            search.Location = "Brighton";

            this.Item = search;
            this.LoadRecentSearches();

            base.Navigated(parameter);
        }

        protected async void LoadRecentSearches()
        {
            var searchResult = await this.LocalRepository.GetAllAsync(typeof(RecentSearch), new SelectParameter());
            var sortedItems = searchResult.Items.OfType<RecentSearch>().OrderByDescending(o => o.Date);

            this.Item.RecentSearches.Clear();

            foreach (object item in sortedItems)
            {
                var recentSearch = item as RecentSearch;
                if (recentSearch != null)
                    this.Item.RecentSearches.Add(recentSearch);
            }
        }

        protected  async void SaveRecentSearch()
        {
            var recentSearch = this.Item.RecentSearches.FirstOrDefault(
                o => o.Recent.ToLowerInvariant() == this.Item.Location.ToLowerInvariant());

            if (recentSearch == null)
            {
                RecentSearch newRecent = new RecentSearch();
                newRecent.Recent = this.Item.Location;
                newRecent.TotalResult = this.Item.ItemCount;
                newRecent.Date = DateTime.Now;

                this.Item.RecentSearches.Insert(0, newRecent);
                await this.LocalRepository.InsertAsync(newRecent);
            }
            else
            {
                if (this.Item.RecentSearches.IndexOf(recentSearch) > 0)
                {
                    this.Item.RecentSearches.Remove(recentSearch);
                    this.Item.RecentSearches.Insert(0, recentSearch);
                }

                recentSearch.Date = DateTime.Now;
                await this.LocalRepository.UpdateAsync(recentSearch);
            }
        }

        protected virtual void ShowSearchResult(SearchResult transferedResult)
        {            
            this.NavigationService.Navigate<PropertyListViewModel>(
                new NavigationParameter(transferedResult)
                {
                    NavigationMode = NavigationMode.Push,
                    EnsureNavigationContext = true,
                    ModalPresentationStyle = ModalPresentationStyle.FormSheet
                });
        }

        #endregion
    }
}