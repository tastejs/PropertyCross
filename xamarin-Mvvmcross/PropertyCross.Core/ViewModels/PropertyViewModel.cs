using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Input;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.Domain.Model;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.ViewModels
{
    public class PropertyViewModel : MvxViewModel
    {
        private readonly PropertyFinderPersistentState _state;
        private bool _isFavourited;
        public Property Property { get; set; }
        private bool _isLoading = true;
        private PropertyFinderPersistentState state;
        public PropertyViewModel(PropertyFinderPersistentState state)
        {
            _state = state;
        }

        public PropertyViewModel(PropertyFinderPersistentState state, Property property)
        {
            _state = state;
            Init(property);
        }


        public void Init(Property property)
        {
            Property = property;
            PriceText = property.Price.ToString("C0");
            DetailsText = string.Format("{0} {1} bed {2}", property.ShortTitle, property.Bedrooms,
                property.PropertyType);
            ImageUri = new Uri(property.ImageUrl);
            PropertyOverview = string.Format("{0} {1}", property.BedBathroomText, property.PropertyType);
            PropertyInformation = property.Summary;
            Location = property.ShortTitle;

            ToggleIsFavouriteCommand= new MvxCommand(()=>IsFavourited=!IsFavourited);

            IsFavourited = _state.IsPropertyFavourited(property);

            _isLoading = false;
        }

        

        public string PriceText { get; set; }

        public string DetailsText { get; set; }

        public Uri ImageUri { get; set; }

        public string PropertyInformation { get; set; }

        public string PropertyOverview { get; set; }
        public string Location { get; set; }

        public bool IsFavourited
        {
            get { return _isFavourited; }
            set
            {
                _isFavourited = value; RaisePropertyChanged(()=>IsFavourited);
                RaisePropertyChanged(()=>ButtonText);
                if (!_isLoading)
                {
                    _state.ToggleFavourite(Property);
                }
            }
        }

        public ICommand ToggleIsFavouriteCommand
        {
            get; private set;
        }

        public string ButtonText
        {
            get
            {
                if (IsFavourited)
                {
                    return "Remove from favourites";
                }
                else
                {
                    return "Add to favourites";
                }
            }
        }
    }
}
