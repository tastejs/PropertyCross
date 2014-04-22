
namespace PropertyCross.Presenter
{
  /// <summary>
  /// A service which provides state persistence.
  /// </summary>
  public interface IStatePersistenceService
  {
    void SaveState(PropertyCrossPersistentState state);

    PropertyCrossPersistentState LoadState();
  }
}
