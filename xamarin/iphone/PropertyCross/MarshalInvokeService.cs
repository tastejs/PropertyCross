using System;
using PropertyCross.Presenter;
using MonoTouch.Foundation;

namespace PropertyCross
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

