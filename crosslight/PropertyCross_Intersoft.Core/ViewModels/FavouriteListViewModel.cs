using Intersoft.AppFramework.Models;
using Intersoft.AppFramework.ModelServices;
using Intersoft.Crosslight;
using Intersoft.Crosslight.ViewModels;
using PropertyCross_Intersoft.Models;
using System.Collections.ObjectModel;
namespace PropertyCross_Intersoft.ViewModels
{
    public class FavouriteListViewModel : EditableListViewModelBase<Property>
    {
        #region Constructors

        public FavouriteListViewModel()
        {
            this.LocalRepository = new LocalDataRepository();
        }

        #endregion

        #region Properties

        protected LocalDataRepository LocalRepository { get; set; }
        
        #endregion

        #region Methods

        public override void Navigated(NavigatedParameter parameter)
        {
            base.Navigated(parameter);
            this.GetFavouriteList();
        }

        public async void GetFavouriteList()
        {
            ISelectResult searchResult = await this.LocalRepository.GetAllAsync(typeof(Property), new SelectParameter());
            ObservableCollection<Property> favouritelistings = new ObservableCollection<Property>();

            foreach (object item in searchResult.Items)
            {
                Property listing = item as Property;
                if (favouritelistings != null)
                    favouritelistings.Add(listing);
            }

            this.SourceItems = favouritelistings;
        }
     
        #endregion
    }
}

