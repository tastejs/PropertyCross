using System;
using System.Collections;
using System.Linq;

using CoreGraphics;
using Foundation;
using Intersoft.Crosslight;
using Intersoft.Crosslight.iOS;
using PropertyCross_Intersoft.Core;
using PropertyCross_Intersoft.ViewModels;
using UIKit;

namespace PropertyCross_Intersoft.iOS
{
    [ImportBinding(typeof(PropertyListBindingProvider))]
    [RegisterNavigation(DeviceKind.Phone)]
    public class PropertyListViewController : UITableViewController<PropertyListViewModel>
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

        public override BasicImageLoaderSettings ImageLoaderSettings
        {
            get
            {
                return new ImageLoaderSettings()
                {
                    AnimateOnLoad = true
                };
            }
        }

        public override string TitleMemberPath
        {
            get
            {
                return "TitleText";
            }
        }

        protected override void InitializeView()
        {
            base.InitializeView();

            this.Appearance.HideSeparatorOnEmptyCell = true;
        }
    }
}

