using System.Runtime.Serialization;
using Intersoft.Crosslight;

namespace PropertyCross_Intersoft.DomainModels.Inventory
{
    [Serializable]
    partial class Category
    {
        #region Fields

        private byte[] _largeImage;

        #endregion

        #region Properties

        [IgnoreDataMember]
        public byte[] LargeImage
        {
            get { return _largeImage; }
            set
            {
                if (_largeImage != value)
                {
                    _largeImage = value;
                    this.OnPropertyChanged("LargeImage");
                }
            }
        }

        #endregion
    }
}