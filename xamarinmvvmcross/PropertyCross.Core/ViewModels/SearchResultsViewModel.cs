using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Windows.Input;
using Cirrious.MvvmCross.ViewModels;
using PropertyCross.Core.Domain.Model;
using PropertyCross.Core.Domain.SearchItem;
using PropertyCross.Core.Domain.Services;

namespace PropertyCross.Core.ViewModels
{
    public class SearchResultsViewModel : ViewModelBase
    {
        private readonly PropertyFinderPersistentState _stateFactory;
        private readonly PropertyDataSource _dataSource;
        private bool _isMoreAvailable;
        private SearchItemBase _searchItem;
        private int _pageNumber = 0;
        private ObservableCollection<PropertyViewModel> _properties;
        private int _totalResults;
        private string _location;
        private string _title;
        private string _footer;

        public SearchResultsViewModel(PropertyFinderPersistentState stateFactory,
      PropertyDataSource dataSource)
        {
            _stateFactory = stateFactory;
            _dataSource = dataSource;
            Properties= new ObservableCollection<PropertyViewModel>();
            PropertiesSelectedCommand = new MvxCommand<PropertyViewModel>(DoPropertiesSelected);
            LoadMoreCommand = new MvxCommand(DoLoadMore);
            Title = "Loading...";
        }

        public void DoPropertiesSelected(PropertyViewModel propertyViewModel)
        {
            ShowViewModel<PropertyViewModel>(propertyViewModel.Property);
        }
        public void Init(PlainTextSearchItem searchItem)
        {
            if (!string.IsNullOrWhiteSpace(searchItem.SearchText))
            {
                InitSearch(searchItem);
            }

        }
        public void Init(GeoLocation location)
        {
            if(location.Latitude+location.Longitude>0)
            {
                GeoLocationSearchItem searchItem = new GeoLocationSearchItem(location);

                InitSearchBase(searchItem);
            }
            
        }

        private void InitSearchBase(SearchItemBase searchItem)
        {
            _searchItem = searchItem;
            Location = searchItem.DisplayText;
            DoLoadMore();
        }

        public void InitSearch(PlainTextSearchItem searchItem)
        {
            if (default(PlainTextSearchItem) != searchItem)
            {
                InitSearchBase(searchItem);
            }
        }
        private void DoLoadMore()
        {
            _pageNumber++;
            IsBusy = true;
            Title = "Loading...";
            _searchItem.FindProperties(_dataSource, _pageNumber, response =>
            {
                
                var result = response as PropertyListingsResult;
                if (result != null)
                {
                    int totalPages = result.TotalPages;
                    foreach (var property in result.Data)
                    {
                        Properties.Add(new PropertyViewModel(_stateFactory,property));                        
                    }

                    RaisePropertyChanged(()=>PropertiesLoaded);
                    TotalResults = result.TotalResult;
                     IsMoreAvailable = _pageNumber < totalPages;
                    IsBusy = false;

                    Title = string.Format("{0} of {1} matches", PropertiesLoaded, TotalResults);                   
                }
            }, error =>
            {
                IsBusy = false;
            });
        }

        public bool IsMoreAvailable
        {
            get { return _isMoreAvailable; }
            set { _isMoreAvailable = value;
                RaisePropertyChanged(() => IsMoreAvailable);
            }
        }

        public ObservableCollection<PropertyViewModel> Properties
        {
            get { return _properties; }
            set { _properties = value; RaisePropertyChanged(()=>Properties);}
        }

        public string Location
        {
            get { return _location; }
            set
            {
                _location = value;
                RaisePropertyChanged(()=>Location);
            }
        }

        public int  PropertiesLoaded {
            get
            {
                return Properties.Count();
            }
        }

        public int TotalResults
        {
            get { return _totalResults; }
            set
            {
                _totalResults = value; 
                RaisePropertyChanged(()=>TotalResults);
            }
        }

        public ICommand PropertiesSelectedCommand { get; private set; }
        public ICommand LoadMoreCommand { get; private set; }


        public string Title
        {
            get { return _title; }
            set
            {
                _title = value; 
                RaisePropertyChanged(()=>Title);
            }
        }

    }
}
