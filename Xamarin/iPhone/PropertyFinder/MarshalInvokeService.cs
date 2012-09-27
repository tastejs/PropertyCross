using System;
using PropertyFinder.Presenter;
using MonoTouch.Foundation;

namespace PropertyFinder
{
  public class MarshalInvokeService : IMarshalInvokeService
  {
    private NSObject _obj = new NSObject();

    public MarshalInvokeService ()
    {
    }

    public void Invoke (Action action)
    {
      _obj.InvokeOnMainThread(() => action());
    }
  }
}

