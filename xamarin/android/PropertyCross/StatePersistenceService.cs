using PropertyCross.Presenter;
using Android.Content;
using System.Xml.Serialization;
using System.IO;

namespace com.propertycross.xamarin.android
{
	public class StatePersistenceService : IStatePersistenceService
	{
		private readonly string FileName = "data.txt";
		private PropertyCrossApplication application;

		public StatePersistenceService(PropertyCrossApplication application)
		{
			this.application = application;
		}

		public void SaveState(PropertyCrossPersistentState state)
		{
			using(var stream = application.CurrentActivity.OpenFileOutput(FileName, FileCreationMode.Private))
			{
				XmlSerializer serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
				serializer.Serialize(stream, state);
			}
		}
		
		public PropertyCrossPersistentState LoadState()
		{
			PropertyCrossPersistentState state = null;

			try
			{
				using(var stream = application.CurrentActivity.OpenFileInput(FileName))
				using(var reader = new StreamReader(stream))
				{
					if(!reader.EndOfStream)
					{
						XmlSerializer serializer = new XmlSerializer(typeof(PropertyCrossPersistentState));
						state = (PropertyCrossPersistentState) serializer.Deserialize(reader);
						state.PersistenceService = this;
					}
				}
			}
			catch
			{
			}

			if(state == null)
				state = new PropertyCrossPersistentState(this);
			return state;
		}
	}
}

