using System.IO;
using System.IO.IsolatedStorage;
using System.Xml.Serialization;
using PropertyFinder.ViewModel;
using System.Diagnostics;

namespace PropertyFinder
{
  public class StatePersistenceService : IStatePersistenceService
  {
    public void SaveState(PropertyFinderPersistentState state)
    {
      // persist the data using isolated storage
      using (var store = IsolatedStorageFile.GetUserStoreForApplication())
      using (var stream = new IsolatedStorageFileStream("data.txt",
                                  FileMode.Create, FileAccess.Write, store))
      {
        var serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
        serializer.Serialize(stream, state);
      }
    }

    public PropertyFinderPersistentState LoadState()
    {
      PropertyFinderPersistentState state = null;

      try
      {
        // load from isolated storage
        using (var store = IsolatedStorageFile.GetUserStoreForApplication())
        using (var stream = new IsolatedStorageFileStream("data.txt",
                                  FileMode.OpenOrCreate, FileAccess.Read, store))
        using (var reader = new StreamReader(stream))
        {
          if (!reader.EndOfStream)
          {
            var serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
            state = (PropertyFinderPersistentState)serializer.Deserialize(reader);

            // set the persistence service for the newly loaded state
            state.PersistenceService = this;
          }
        }
      }
      catch
      {
      }

      // if we cannot retrieve the state, create a new state object
      if (state == null)
      {
        state = new PropertyFinderPersistentState(this);
      }

      return state;
    }
  }
}
