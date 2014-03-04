using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using Cirrious.CrossCore.Converters;

namespace PropertyCross.Core.Converter
{
    public class NegatedValueConverter : MvxValueConverter<bool,bool>
    {
        protected override bool Convert(bool value, Type targetType, object parameter, CultureInfo culture)
        {
            return !value;
        }

        protected override bool ConvertBack(bool value, Type targetType, object parameter, CultureInfo culture)
        {
            return !value;
        }
    }
}
