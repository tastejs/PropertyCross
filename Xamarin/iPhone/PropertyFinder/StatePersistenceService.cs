using System;
using PropertyFinder.Presenter;
using System.IO;
using System.Xml.Serialization;

namespace PropertyFinder
{
	public class StatePersistenceService : IStatePersistenceService
	{
    private string _filepath;

		public StatePersistenceService ()
		{
      string path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
      _filepath = Path.Combine(path, "state.txt");
		}

		#region IStatePersistenceService implementation
		public void SaveState (PropertyFinderPersistentState state)
		{
      using (var writer = new StreamWriter(_filepath))
      {
        var serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
        serializer.Serialize(writer, state);
      }

		}

		public PropertyFinderPersistentState LoadState ()
		{
      PropertyFinderPersistentState state = null;

      try
      {
        using (var reader = new StreamReader(_filepath))
        {
          var serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
          state = (PropertyFinderPersistentState)serializer.Deserialize(reader);
          state.PersistenceService = this;
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
		#endregion

	}
}

