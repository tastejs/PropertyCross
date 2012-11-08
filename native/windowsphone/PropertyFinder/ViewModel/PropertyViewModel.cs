using PropertyFinder.Model;
using System;

namespace PropertyFinder.ViewModel
{
  /// <summary>
  /// A presenter that renders a single property
  /// </summary>
  public class PropertyViewModel : ViewModelBase
  {
    private Property _property;

    private PropertyFinderPersistentState _state;

    private bool _isFavourited;

    public PropertyViewModel(ViewModelBase parent, PropertyFinderPersistentState state, Property property)
    {
      _state = state;
      _property = property;
      _isFavourited = state.IsPropertyFavourited(property);
      Parent = parent;
    }

    public ViewModelBase Parent { get; private set; }

    public bool IsFavourited
    {
      get { return _isFavourited; }
      set
      {
        SetField<bool>(ref _isFavourited, value, "IsFavourited",  
          () => {
            _state.SetPropertyFavourited(Property, _isFavourited);
          });
      }
    }

    public Property Property
    {
      get { return _property; }
    }
  }
}
