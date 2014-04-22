using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PropertyCross.Presenter
{
  /// <summary>
  /// A service which marshals invocations onto the UI thread.s
  /// </summary>
  public interface IMarshalInvokeService
  {
    void Invoke(Action action);
  }
}
