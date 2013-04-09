using System;
using System.Windows.Data;
using System.Globalization;
using System.Windows;

namespace PropertyFinder.Converter
{
  public class BoolToVisibilityConverter : IValueConverter
  {

    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
      bool boolValue = ((bool)value);
      if (parameter is String)
      {
        boolValue = !boolValue;
      }
      return boolValue ? Visibility.Visible : Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
      throw new NotImplementedException();
    }
  }
}
