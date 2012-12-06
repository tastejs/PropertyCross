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
      return ((bool)value) ? Visibility.Visible : Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
      throw new NotImplementedException();
    }
  }
}
