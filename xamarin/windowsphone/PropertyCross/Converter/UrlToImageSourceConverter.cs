using System;
using System.Windows.Data;
using System.Globalization;
using System.Windows.Media.Imaging;

namespace PropertyCross.Converter
{
  public class UrlToImageSourceConverter : IValueConverter
  {
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
      if (value == null)
        return null;

      Uri uri = new Uri((string)value);
      return new BitmapImage(uri);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
      throw new NotImplementedException();
    }
  }
}
