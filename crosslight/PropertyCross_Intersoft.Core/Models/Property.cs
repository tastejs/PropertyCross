using Intersoft.AppFramework.Models;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Data.ComponentModel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace PropertyCross_Intersoft.Models
{
    [Serializable]
    public partial class Property : ModelBase
    {
        #region Fields

        private string _specification;
        private bool _isFavorite;

        #endregion

        #region Properties

        [DataMember(Name = "auction_date")]
        public int AuctionDate { get; set; }

        [DataMember(Name = "bathroom_number")]
        public int BathroomNumber { get; set; }

        [DataMember(Name = "bedroom_number")]
        public int BedroomNumber { get; set; }

        public string Specification
        {
            get { return _specification; }
            set
            {
                if (_specification != value)
                {
                    _specification = value;
                    this.OnPropertyChanged("Specification");
                }
            }
        }

        [DataMember(Name = "car_spaces")]
        public int CarSpaces { get; set; }

        [DataMember(Name = "construction_year")]
        public int ConstructionYear { get; set; }

        [DataMember(Name = "datasource_name")]
        public string DatasourceName { get; set; }

        [PrimaryKey]
        [DataMember(Name = "guid")]
        public string Guid { get; set; }

        [DataMember(Name = "img_height")]
        public int ImgHeight { get; set; }

        [DataMember(Name = "img_url")]
        public string ImgUrl { get; set; }

        [DataMember(Name = "img_width")]
        public int ImgWidth { get; set; }

        [DataMember(Name = "keywords")]
        public string Keywords { get; set; }

        [DataMember(Name = "latitude")]
        public decimal Latitude { get; set; }

        [DataMember(Name = "lister_name")]
        public string ListerName { get; set; }

        [DataMember(Name = "lister_url")]
        public string ListerUrl { get; set; }

        [DataMember(Name = "listing_type")]
        public string ListingType { get; set; }

        [DataMember(Name = "location_accuracy")]
        public int LocationAccuracy { get; set; }

        [DataMember(Name = "longitude")]
        public decimal Longitude { get; set; }

        [DataMember(Name = "price")]
        public int Price { get; set; }

        [DataMember(Name = "price_currency")]
        public string PriceCurrency { get; set; }

        [DataMember(Name = "price_formatted")]
        public string PriceFormatted { get; set; }

        public string PriceFormatted2
        {
            get
            {
                CultureInfo currencyCulture = new CultureInfo("en-GB");

                return string.Format(currencyCulture,"{0:C0}",this.Price);
            }
        }

        [DataMember(Name = "price_high")]
        public int PriceHigh { get; set; }

        [DataMember(Name = "price_low")]
        public int PriceLow { get; set; }

        [DataMember(Name = "price_type")]
        public string PriceType { get; set; }

        [DataMember(Name = "property_type")]
        public string PropertyType { get; set; }

        [DataMember(Name = "summary")]
        public string Summary { get; set; }

        [DataMember(Name = "thumb_height")]
        public int ThumbHeight { get; set; }

        [DataMember(Name = "thumb_url")]
        public string ThumbUrl { get; set; }

        [DataMember(Name = "thumb_width")]
        public int ThumbWidth { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }

        [IgnoreDataMember]
        public bool IsFavorite
        {
            get
            {
                return _isFavorite;
            }
            set
            {
                if (_isFavorite != value)
                {
                    _isFavorite = value;
                    OnPropertyChanged("IsFavorite");
                }
            }
        }

        #endregion
    }
}
