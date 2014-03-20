using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using Cirrious.CrossCore.Converters;
using Cirrious.CrossCore.WindowsPhone.Converters;

namespace PropertyCross.WindowsPhone.NativeConverters
{
    public class BooleanToFavouriteImageUri : IValueConverter
    {
        protected string Convert(bool value, Type targetType, object parameter, CultureInfo culture)
        {
            if (!value)
            {
                return "/Images/favourite.png";
            }
            return "/Images/unfavourite.png";

        }

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return Convert((bool) value, targetType, parameter, culture);
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
