using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Intersoft.AppFramework.Models;
using Intersoft.AppFramework.ModelServices;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Input;
using Intersoft.Crosslight.ViewModels;
using PropertyCross_Intersoft.Models;

namespace PropertyCross_Intersoft.ViewModels
{
    public class PropertyDetailViewModel : EditorViewModelBase<Property>
    {
        #region Constructors

        public PropertyDetailViewModel()
        {
            this.LocalRepository = new LocalDataRepository();
            this.FavoriteCommand = new DelegateCommand(ExecuteFavorite);
        }

        #endregion

        #region Properties

        protected LocalDataRepository LocalRepository { get; set; }
        
        public DelegateCommand FavoriteCommand { get; set; }

        #endregion

        #region Methods

        public async override void Navigated(NavigatedParameter parameter)
        {
            base.Navigated(parameter);

            this.Item = parameter.Data as Property;
            this.Item.Specification = this.Item.BedroomNumber + " bedroom, " + this.Item.BathroomNumber + " bathroom " + this.Item.PropertyType;

            ISelectResult favoriteList = await this.LocalRepository.GetAllAsync(typeof(Property), new SelectParameter());
            if (favoriteList.Items.OfType<Property>().FirstOrDefault(o => o.Guid == this.Item.Guid) != null)
                this.Item.IsFavorite = true;
        }

        private async void ExecuteFavorite(object parameter)
        {
            if (!this.Item.IsFavorite)
            {
                await this.LocalRepository.InsertAsync(this.Item);

                this.Item.IsFavorite = true;
                this.ToastPresenter.Show("Saved to Favorite", ToastDisplayDuration.Immediate);

                // notify any living ViewModels to add this item accordingly.
                EventAggregator.Default.Publish<DataInsertedEvent<Property>, IEnumerable<Property>>(new Property[] { this.Item });
            }
            else
            {
                await this.LocalRepository.DeleteAsync(this.Item);

                this.Item.IsFavorite = false;
                this.ToastPresenter.Show("Removed from Favorite", ToastDisplayDuration.Immediate);

                // notify any living ViewModels to remove this item accordingly.
                EventAggregator.Default.Publish<DataRemovedEvent<Property>, IEnumerable<Property>>(new Property[] { this.Item });
            }
        }

        #endregion
    }
}
