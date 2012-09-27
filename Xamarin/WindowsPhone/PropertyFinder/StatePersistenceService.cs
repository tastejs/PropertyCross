using System.IO;
using System.IO.IsolatedStorage;
using System.Xml.Serialization;
using PropertyFinder.Presenter;
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
        using (var store = IsolatedStorageFile.GetUserStoreForApplication())
        using (var stream = new IsolatedStorageFileStream("data.txt",
                                  FileMode.OpenOrCreate, FileAccess.Read, store))
        using (var reader = new StreamReader(stream))
        {
          if (!reader.EndOfStream)
          {
            var serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
            state = (PropertyFinderPersistentState)serializer.Deserialize(reader);
          }
        }
      }
      catch
      {
      }

      if (state == null)
      {
        state = new PropertyFinderPersistentState(this);
      }

      return state;
    }
  }
}
