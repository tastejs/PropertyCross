
namespace PropertyFinder.ViewModel
{
  /// <summary>
  /// A service which provides navigation from page to page.
  /// </summary>
  public interface INavigationService
  {
    /// <summary>
    /// Navigates to a view for the given presenter.
    /// </summary>
    void PushViewModel(object presenter);
  }
}
