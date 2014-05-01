// WARNING
//
// This file has been generated automatically by MonoDevelop to store outlets and
// actions made in the Xcode designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using MonoTouch.Foundation;

namespace PropertyCross
{
	[Register ("PropertyViewController")]
	partial class PropertyViewController
	{
		[Outlet]
		MonoTouch.UIKit.UILabel priceLabel { get; set; }

		[Outlet]
		MonoTouch.UIKit.UILabel titleLabel { get; set; }

		[Outlet]
		MonoTouch.UIKit.UILabel bedBathroomLabel { get; set; }

		[Outlet]
		MonoTouch.UIKit.UILabel descriptionLabel { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIImageView imageView { get; set; }
		
		void ReleaseDesignerOutlets ()
		{
			if (priceLabel != null) {
				priceLabel.Dispose ();
				priceLabel = null;
			}

			if (titleLabel != null) {
				titleLabel.Dispose ();
				titleLabel = null;
			}

			if (bedBathroomLabel != null) {
				bedBathroomLabel.Dispose ();
				bedBathroomLabel = null;
			}

			if (descriptionLabel != null) {
				descriptionLabel.Dispose ();
				descriptionLabel = null;
			}

			if (imageView != null) {
				imageView.Dispose ();
				imageView = null;
			}
		}
	}
}
