using System.ComponentModel;
using System;

namespace PropertyFinder.Presenter
{
  public class ViewModelBase : INotifyPropertyChanged
  {
    protected void OnPropertyChanged(string property)
    {
      if (PropertyChanged != null)
      {
        PropertyChanged(this, new PropertyChangedEventArgs(property));
      }
    }

    protected void SetField<T>(ref T field, T value, string propertyName, Action changed = null)
    {
      if (object.Equals(field, value))
        return;

      field = value;

      if (changed!=null)
      {
        changed();
      }

      OnPropertyChanged(propertyName);
    }

    public event PropertyChangedEventHandler PropertyChanged;
  }
}
