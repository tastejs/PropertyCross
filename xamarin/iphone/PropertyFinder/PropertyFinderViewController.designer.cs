// WARNING
//
// This file has been generated automatically by MonoDevelop to store outlets and
// actions made in the Xcode designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using MonoTouch.Foundation;

namespace PropertyFinder
{
	[Register ("MainPageViewController")]
	partial class PropertyFinderViewController
	{
		[Outlet]
		MonoTouch.UIKit.UITextField searchLocationText { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIButton goButton { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIButton myLocationButton { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIActivityIndicatorView searchActivityIndicator { get; set; }

		[Outlet]
		MonoTouch.UIKit.UITableView tableView { get; set; }

		[Outlet]
		MonoTouch.UIKit.UILabel userMessageLabel { get; set; }

		[Action ("goButtonTouched:")]
		partial void goButtonTouched (MonoTouch.Foundation.NSObject sender);

		[Action ("searchLocationTextChanged:")]
		partial void searchLocationTextChanged (MonoTouch.Foundation.NSObject sender);

		[Action ("myLocationButtonTouched:")]
		partial void myLocationButtonTouched (MonoTouch.Foundation.NSObject sender);
		
		void ReleaseDesignerOutlets ()
		{
			if (searchLocationText != null) {
				searchLocationText.Dispose ();
				searchLocationText = null;
			}

			if (goButton != null) {
				goButton.Dispose ();
				goButton = null;
			}

			if (myLocationButton != null) {
				myLocationButton.Dispose ();
				myLocationButton = null;
			}

			if (searchActivityIndicator != null) {
				searchActivityIndicator.Dispose ();
				searchActivityIndicator = null;
			}

			if (tableView != null) {
				tableView.Dispose ();
				tableView = null;
			}

			if (userMessageLabel != null) {
				userMessageLabel.Dispose ();
				userMessageLabel = null;
			}
		}
	}
}
