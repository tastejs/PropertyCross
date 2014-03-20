using System;
using MonoTouch.Foundation;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Touch.Services
{
    public class MarshalInvokeService : IMarshalInvokeService
    {
        private NSObject _obj = new NSObject();

        public MarshalInvokeService()
        {
        }

        public void Invoke(Action action)
        {
            _obj.InvokeOnMainThread(() => action());
        }
    }
}

