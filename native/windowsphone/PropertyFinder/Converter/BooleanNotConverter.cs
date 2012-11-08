using System;
using System.Windows.Data;
using System.Globalization;

namespace PropertyFinder.Converter
{
  public class BooleanNotConverter : IValueConverter
  {

    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
      return !((bool)value);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
      throw new NotImplementedException();
    }
  }
}
