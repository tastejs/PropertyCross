using System;
using System.Collections.Generic;
using PropertyCross.Model;

namespace PropertyCross.Presenter
{
  /// <summary>
  /// A presenter which allows the user to view their favourites.
  /// </summary>
  public class FavouritesPresenter
  {
    /// <summary>
    /// The interface this presenter requires from the assocaited view.
    /// </summary>
    public interface View
    {
      void SetFavourites(List<Property> properties);

      event EventHandler<PropertyEventArgs> PropertySelected;
    }

    private PropertyCrossPersistentState _state;

    private INavigationService _navigationService;

    public FavouritesPresenter(INavigationService navigationService, PropertyCrossPersistentState state)
    {
      _state = state;
      _navigationService = navigationService;
    }

    public void SetView(View view)
    {
      view.SetFavourites(_state.Favourites);
      view.PropertySelected -= View_PropertySelected;
      view.PropertySelected += View_PropertySelected;
    }

    private void View_PropertySelected(object sender, PropertyEventArgs e)
    {
      var presenter = new PropertyPresenter(_state, e.Property);
      _navigationService.PushPresenter(presenter);
    }
  }
}
