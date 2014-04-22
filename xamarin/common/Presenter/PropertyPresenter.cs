using PropertyCross.Model;
using System;

namespace PropertyCross.Presenter
{
  /// <summary>
  /// A presenter that renders a single property
  /// </summary>
  public class PropertyPresenter
  {
    /// <summary>
    /// The interface this presenter requires from the assocaited view.
    /// </summary>
    public interface View
    {
      void SetProperty(Property property);

      bool IsFavourited { set; }

      event EventHandler ToggleFavourite;
    }

    private Property _property;

    private PropertyCrossPersistentState _state;

    private View _view;

    public PropertyPresenter(PropertyCrossPersistentState state, Property property)
    {
      _state = state;
      _property = property;
    }

    public void SetView(View view)
    {
      _view = view;

      view.SetProperty(_property);
      view.ToggleFavourite += View_ToggleFavourite;
      view.IsFavourited = _state.IsPropertyFavourited(_property);
    }

    private void View_ToggleFavourite(object sender, EventArgs e)
    {
      _state.ToggleFavourite(_property);
      _view.IsFavourited = _state.IsPropertyFavourited(_property);
    }
  }
}
