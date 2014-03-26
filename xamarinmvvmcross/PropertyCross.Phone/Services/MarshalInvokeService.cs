using System;
using System.Windows;
using System.Windows.Threading;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.WindowsPhone.Services
{
    public class MarshalInvokeService : IMarshalInvokeService
    {
        public void Invoke(Action action)
        {
            Deployment.Current.Dispatcher.BeginInvoke(action);            
        }
    }
}
