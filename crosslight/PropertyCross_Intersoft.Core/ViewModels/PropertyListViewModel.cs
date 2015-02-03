using System.Linq;
using Intersoft.AppFramework;
using Intersoft.AppFramework.ViewModels;
using Intersoft.Crosslight;
using Intersoft.Crosslight.Input;
using PropertyCross_Intersoft.Models;
using PropertyCross_Intersoft.ModelServices;

namespace PropertyCross_Intersoft.ViewModels
{
    public class PropertyListViewModel : DataListViewModelBase<Property, IPropertyRepository>
    {
        #region Fields

        private PropertyListQueryDefinition _queryDefinition = null;

        #endregion

        #region Constructor

        public PropertyListViewModel()
        {
            // configure data behaviors
            this.EnableRefresh = true;
            this.EnableIncrementalRefresh = true;
            this.EnableIncrementalLoading = true;
            this.EnableAsyncFilter = true;
            this.IncrementalLoadingSize = 20;

            // commands
            this.LoadIncrementalCommand = new DelegateCommand(ExecuteLoadIncrementalCommand, CanExecuteLoadIncrementalCommand);
        }

        #endregion

        #region Commands

        public DelegateCommand LoadIncrementalCommand
        {
            get;
            set;
        }

        #endregion

        #region Properties

        public override string TitleText
        {
            get
            {
                if (this.Items != null)
                    return this.Items.Count() + " of " + this.ViewQuery.GetQueryDescriptor().PageDescriptor.TotalItemCount + " results";

                return "Loading";
            }
        }

        protected override IQueryDefinition ViewQuery
        {
            get
            {
                if (_queryDefinition == null)
                    _queryDefinition = new PropertyListQueryDefinition();
                return _queryDefinition;
            }
        }

        #endregion

        #region Methods

        public override void Navigated(NavigatedParameter parameter)
        {
            if (parameter.Data is SearchResult)
            {
                SearchResult transferedResult = parameter.Data as SearchResult;
                this.ViewQuery.FilterQuery = transferedResult.Location;
                base.OnDataLoaded(transferedResult.Items, DataLoadingMode.Load);
            }
            else
            {
                RecentSearch recent = parameter.Data as RecentSearch;
                this.ViewQuery.FilterQuery = recent.Recent;
                base.Navigated(parameter);
            }
        }

        private bool CanExecuteLoadIncrementalCommand(object paramater)
        {
            return this.EnableIncrementalLoading;
        }

        private void ExecuteLoadIncrementalCommand(object parameter)
        {
            this.LoadDataIncremental();
        }

        #endregion
    }
}

