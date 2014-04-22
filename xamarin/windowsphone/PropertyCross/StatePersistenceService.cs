using System.IO;
using System.IO.IsolatedStorage;
using System.Xml.Serialization;
using PropertyCross.Presenter;
using System.Diagnostics;

namespace PropertyCross
{
  public class StatePersistenceService : IStatePersistenceService
  {
    public void SaveState(PropertyCrossPersistentState state)
    {
      // persist the data using isolated storage
      using (var store = IsolatedStorageFile.GetUserStoreForApplication())
      using (var stream = new IsolatedStorageFileStream("data.txt",
                                  FileMode.Create, FileAccess.Write, store))
      {
        var serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
        serializer.Serialize(stream, state);
      }
    }

    public PropertyCrossPersistentState LoadState()
    {
      PropertyCrossPersistentState state = null;

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
            var serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
            state = (PropertyCrossPersistentState)serializer.Deserialize(reader);

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
        state = new PropertyCrossPersistentState(this);
      }

      return state;
    }
  }
}
