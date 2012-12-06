using PropertyFinder.Model;

namespace PropertyFinder.ViewModel
{
  public class LocationViewModel : ViewModelBase
  {
    public LocationViewModel(ViewModelBase parent, Location location)
    {
      Parent = parent;
      Location = location;
    }

    public ViewModelBase Parent { get; private set; }

    public Location Location { get; private set; }
  }
}
