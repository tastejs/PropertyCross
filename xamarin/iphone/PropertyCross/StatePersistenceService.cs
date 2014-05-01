using System;
using PropertyCross.Presenter;
using System.IO;
using System.Xml.Serialization;

namespace PropertyCross
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
		public void SaveState (PropertyCrossPersistentState state)
		{
      using (var writer = new StreamWriter(_filepath))
      {
        var serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
        serializer.Serialize(writer, state);
      }

		}

		public PropertyCrossPersistentState LoadState ()
		{
      PropertyCrossPersistentState state = null;

      try
      {
        using (var reader = new StreamReader(_filepath))
        {
          var serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
          state = (PropertyCrossPersistentState)serializer.Deserialize(reader);
          state.PersistenceService = this;
        }
      }
      catch
      {
      }

      if (state == null)
      {
        state = new PropertyCrossPersistentState(this);
      }

      return state;
		}
		#endregion

	}
}

