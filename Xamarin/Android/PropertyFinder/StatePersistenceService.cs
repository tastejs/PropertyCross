using PropertyFinder.Presenter;
using Java.IO;
using Android.Content;

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
			/*FileOutputStream fos = context.OpenFileOutput(FileName, FileCreationMode.Private);
			ObjectOutputStream os = new ObjectOutputStream(fos);
			os.WriteObject(this);
			os.Close(); */
		}
		
		public PropertyFinderPersistentState LoadState()
		{
			PropertyFinderPersistentState state = null;

			/*try
			{
				FileInputStream fis = context.OpenFileInput(FileName);
				ObjectInputStream ins = new ObjectInputStream(fis);
				state = (PropertyFinderPersistentState) ins.ReadObject();
				ins.Close();
			}
			catch
			{
			}*/

			if(state == null)
				state = new PropertyFinderPersistentState(this);
			return state;
		}
	}
}

