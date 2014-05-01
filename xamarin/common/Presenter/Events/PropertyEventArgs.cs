using System;
using PropertyCross.Model;

namespace PropertyCross.Presenter
{
  public class PropertyEventArgs : EventArgs
  {
    public PropertyEventArgs(Property property)
    {
      Property = property;
    }

    public Property Property { private set; get; }
  }
}
