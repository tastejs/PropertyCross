using System;
using Intersoft.Crosslight;
using PropertyCross_Intersoft.ViewModels;
using System.Reflection;

namespace PropertyCross_Intersoft.Core
{
    public class PropertyDetailBindingProvider : BindingProvider
    {
        public PropertyDetailBindingProvider()
        {
            this.AddBinding("FavoriteButton", BindableProperties.CommandProperty, "FavoriteCommand");
            this.AddBinding("Price", BindableProperties.TextProperty, "Item.PriceFormatted2");
            this.AddBinding("Title", BindableProperties.TextProperty, "Item.Title");
            this.AddBinding("Summary", BindableProperties.TextProperty, "Item.Summary");
            this.AddBinding("Specification", BindableProperties.TextProperty, "Item.Specification");
            this.AddBinding("ImgUrl", BindableProperties.ImageSourceProperty, "Item.ImgUrl");
        }
    }
}

