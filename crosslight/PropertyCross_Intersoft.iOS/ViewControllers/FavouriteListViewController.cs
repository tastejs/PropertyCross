using System;
using System.Collections;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Linq;
using CoreGraphics;
using Foundation;
using Intersoft.Crosslight;
using Intersoft.Crosslight.iOS;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.Models;
using PropertyCross_Intersoft.ViewModels;
using UIKit;

namespace PropertyCross_Intersoft.iOS
{
    [ImportBinding(typeof(FavouriteListBindingProvider))]
    [RegisterNavigation(DeviceKind.Phone)]
    public class FavouriteListViewController : UITableViewController<FavouriteListViewModel>
    {
        public override TableViewCellStyle CellStyle
        {
            get
            {
                return TableViewCellStyle.Subtitle;
            }
        }

        public override TableViewInteraction InteractionMode
        {
            get
            {
                return TableViewInteraction.Navigation;
            }
        }

        public override ImageSettings CellImageSettings 
        {
            get 
            {
                return new ImageSettings() 
                {
                    ImageSize = new CGSize(36, 36)
                };
            }
        }

        protected override void InitializeView()
        {
            base.InitializeView();

            this.NavigationItem.Title = "Favorites";
            this.Appearance.HideSeparatorOnEmptyCell = true;
        }

        private void HandleCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            this.UpdateWatermark();
        }

        protected override void OnViewModelPropertyChanged(PropertyChangedEventArgs e)
        {
            base.OnViewModelPropertyChanged(e);

            if (e.PropertyName == "SourceItems")
            {
                if (this.ViewModel.SourceItems != null)
                {
                    var observable = this.ViewModel.SourceItems as ObservableCollection<Property>;
                    if (observable != null)
                        observable.CollectionChanged += HandleCollectionChanged;
                }

                this.UpdateWatermark();
            }
        }

        private void UpdateWatermark()
        {
            if (this.ViewModel.SourceItems.Count == 0)
                this.ShowWatermarkView("No favorites yet. Please add one from the property detail.");
            else
                this.HideWatermarkView();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this.ViewModel != null)
                {
                    var observable = this.ViewModel.SourceItems as ObservableCollection<Property>;
                    if (observable != null)
                        observable.CollectionChanged -= HandleCollectionChanged;
                }
            }

            base.Dispose(disposing);
        }
    }
}

