using System.IO;
using System.Xml.Serialization;
using Cirrious.MvvmCross.Plugins.File;

namespace PropertyCross.Core.Domain.Services
{
	public class StatePersistenceService : IStatePersistenceService
	{
	    private readonly IMvxFileStore _fileStore;
	    private readonly string FileName = "data.txt";
		

		public StatePersistenceService(IMvxFileStore fileStore)
		{
		    _fileStore = fileStore;		
		}

	    public void SaveState(PropertyFinderPersistentState state)
	    {
	        _fileStore.WriteFile(FileName, stream =>
	        {
	            XmlSerializer serializer = new XmlSerializer(typeof (PropertyFinderPersistentState));
	            serializer.Serialize(stream, state);
	        });
	    }
		
		public PropertyFinderPersistentState LoadState()
		{
			PropertyFinderPersistentState state = null;

			try
			{
			    string data;
			    if (_fileStore.TryReadTextFile(FileName, out data))
			    {
                    XmlSerializer serializer = new XmlSerializer(typeof(PropertyFinderPersistentState));
                    TextReader reader = new StringReader(data);
                    state = (PropertyFinderPersistentState)serializer.Deserialize(reader);
                    state.PersistenceService = this;
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

