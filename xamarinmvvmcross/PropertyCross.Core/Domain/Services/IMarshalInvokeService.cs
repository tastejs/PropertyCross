using System;

namespace PropertyCross.Core.Domain.Services
{
  /// <summary>
  /// A service which marshals invocations onto the UI thread.s
  /// </summary>
  public interface IMarshalInvokeService
  {
    void Invoke(Action action);
  }
}
