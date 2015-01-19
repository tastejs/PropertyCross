using System;
using Intersoft.Crosslight;
using PropertyCross_Intersoft.ViewModels;
using System.Reflection;

namespace PropertyCross_Intersoft.Core
{
    public class PropertyListBindingProvider : BindingProvider
    {
        public PropertyListBindingProvider()
        {
            ItemBindingDescription itemBinding = new ItemBindingDescription()
            {
                DisplayMemberPath = "PriceFormatted2",
                DetailMemberPath = "Title",
                ImageMemberPath = "ThumbUrl",
                ImagePlaceholder = "item_placeholder.png"
            };

            this.AddBinding("TableView", BindableProperties.ItemsSourceProperty, "Items");
            this.AddBinding("TableView", BindableProperties.ItemTemplateBindingProperty, itemBinding, true);
            this.AddBinding("TableView", BindableProperties.SelectedItemProperty, "SelectedItem", BindingMode.TwoWay);
            this.AddBinding("TableView", BindableProperties.DetailNavigationTargetProperty, new NavigationTarget(typeof(PropertyDetailViewModel)), true);
            this.AddBinding("TableView", BindableProperties.SelectedItemsProperty, "SelectedItems", BindingMode.TwoWay);
            this.AddBinding("ActionBar", BindableProperties.TextProperty, "TitleText");
        }
    }
}

