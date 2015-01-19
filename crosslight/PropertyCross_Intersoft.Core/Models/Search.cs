using Intersoft.AppFramework.Models;
using Intersoft.Crosslight;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace PropertyCross_Intersoft.Models
{
    [Serializable]
    public partial class Search : ModelBase
    {
        #region Constructors

        public Search()
        {
            this.RecentSearches = new ObservableCollection<RecentSearch>();
        }

        #endregion

        #region Fields
        private string _coordinate { get; set; }
        private int _itemcount { get; set; }
        private string _location { get; set; }
        private ObservableCollection<RecentSearch> _recentSearches { get; set; }

        #endregion

        #region Properties
        public string Coordinate
        {
            get { return _coordinate; }
            set
            {
                if (_coordinate != value)
                {
                    _coordinate = value;
                    this.OnPropertyChanged("Coordinate");
                }
            }
        }
        public int ItemCount
        {
            get { return _itemcount; }
            set
            {
                if (_itemcount != value)
                {
                    _itemcount = value;
                    this.OnPropertyChanged("ItemCount");
                }
            }
        }

        public string Location
        {
            get { return _location; }
            set
            {
                if (_location != value)
                {
                    _location = value;
                    this.OnPropertyChanged("Location");
                }
            }
        }

        public ObservableCollection<RecentSearch> RecentSearches
        {
            get { return _recentSearches; }
            set
            {
                if (_recentSearches != value)
                {
                    _recentSearches = value;
                    this.OnPropertyChanged("RecentSearches");
                }
            }
        }

        #endregion
    }
}