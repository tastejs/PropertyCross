using Intersoft.Crosslight;

namespace PropertyCross_Intersoft.Core
{
    public class PropertySearchBindingProvider : BindingProvider
    {
        #region Constructors

        public PropertySearchBindingProvider()
        {
            this.AddBinding("ShowFavoriteButton", BindableProperties.CommandProperty, "ShowFavoriteCommand");
        }

        #endregion
    }
}
