using PropertyCross.Presenter;
using System;

namespace PropertyCross
{
  public class MarshalInvokeService : IMarshalInvokeService
  {
    public void Invoke(Action action)
    {
      // there is no need to marshal to the UI thread with Windows Phone
      action();
    }
  }
}
