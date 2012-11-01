using PropertyFinder.Presenter;
using Android.Content;
using System.Xml.Serialization;
using System.IO;

namespace PropertyFinder
{
	public class StatePersistenceService : IStatePersistenceService
	{
		private readonly string FileName = "data.txt";
		private Context context;

		public StatePersistenceService(Context c)
		{
			this.context = c;
		}

		public void SaveState(PropertyFinderPersistentState state)
		{
			using(var stream = context.OpenFileOutput(FileName, FileCreationMode.Private))
			{
				XmlSerializer serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
				serializer.Serialize(stream, state);
			}
		}
		
		public PropertyFinderPersistentState LoadState()
		{
			PropertyFinderPersistentState state = null;

			try
			{
				using(var stream = context.OpenFileInput(FileName))
				using(var reader = new StreamReader(stream))
				{
					if(!reader.EndOfStream)
					{
						XmlSerializer serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
						state = (PropertyFinderPersistentState) serializer.Deserialize(reader);
						state.PersistenceService = this;
					}
				}
			}
			catch
			{
			}

			if(state == null)
				state = new PropertyFinderPersistentState(this);
			return state;
		}
	}
}

