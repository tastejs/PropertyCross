using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Windows.Input;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.ViewModels
{
    public class FavouritesViewModel : MvxViewModel
    {

        public FavouritesViewModel(PropertyFinderPersistentState state)
        {
           
            Properties = new ObservableCollection<PropertyViewModel>();

            foreach (var property in state.Favourites)
            {
                Properties.Add(new PropertyViewModel(state,property));
            }
            FavouritesSelectedCommand = new MvxCommand<PropertyViewModel>(DoFavouritesSelected);
        }

        private void DoFavouritesSelected(PropertyViewModel property)
        {
            ShowViewModel<PropertyViewModel>(property.Property);
        }

        public ObservableCollection<PropertyViewModel> Properties { get; set; }

        public ICommand FavouritesSelectedCommand { get; set; }

    }
}
