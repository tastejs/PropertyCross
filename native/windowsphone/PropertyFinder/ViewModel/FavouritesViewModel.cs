using System;
using System.Linq;
using System.Collections.Generic;
using PropertyFinder.Model;
using System.Windows.Input;

namespace PropertyFinder.ViewModel
{
  /// <summary>
  /// A view model which allows the user to view their favourites.
  /// </summary>
  public class FavouritesViewModel : ViewModelBase
  {
    private PropertyFinderPersistentState _state;

    private INavigationService _navigationService;

    private List<PropertyViewModel> _properties;

    public FavouritesViewModel(INavigationService navigationService, PropertyFinderPersistentState state)
    {
      _state = state;
      _navigationService = navigationService;
      _properties = state.Favourites.Select(p => new PropertyViewModel(this, state, p)).ToList();
    }

    public List<PropertyViewModel> Properties
    {
      get
      {
        return _properties;
      }
    }

    public ICommand PropertySelectedCommand
    {
      get
      {
        return new DelegateCommand<PropertyViewModel>(property => PropertySelected(property));
      }
    }

    private void PropertySelected(PropertyViewModel property)
    {
      _navigationService.PushViewModel(property);
    }
  }
}
