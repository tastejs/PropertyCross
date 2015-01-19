// WARNING
//
// This file has been generated automatically by Xamarin Studio to store outlets and
// actions made in the UI designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using Foundation;
using System.CodeDom.Compiler;

namespace PropertyCross_Intersoft.iOS
{
	[Register ("PropertyDetailsViewController")]
	partial class PropertyDetailViewController
	{
		[Outlet]
		UIKit.UIImageView ImgUrl { get; set; }

		[Outlet]
		UIKit.UILabel Price { get; set; }

		[Outlet]
		UIKit.UILabel Specification { get; set; }

		[Outlet]
		UIKit.UILabel Summary { get; set; }

		[Outlet]
		UIKit.UILabel Title { get; set; }
		
		void ReleaseDesignerOutlets ()
		{
			if (Title != null) {
				Title.Dispose ();
				Title = null;
			}

			if (Price != null) {
				Price.Dispose ();
				Price = null;
			}

			if (ImgUrl != null) {
				ImgUrl.Dispose ();
				ImgUrl = null;
			}

			if (Summary != null) {
				Summary.Dispose ();
				Summary = null;
			}

			if (Specification != null) {
				Specification.Dispose ();
				Specification = null;
			}
		}
	}
}
