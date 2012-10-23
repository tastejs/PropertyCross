using System;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	public class MarshalInvokeService : IMarshalInvokeService
	{
		public void Invoke (Action action)
		{
			action();
		}
	}
}

