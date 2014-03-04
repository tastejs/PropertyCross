// WARNING
//
// This file has been generated automatically by Xamarin Studio to store outlets and
// actions made in the UI designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//

using MonoTouch.Foundation;

namespace PropertyCross.Touch.Views
{
	[Register ("MainPageViewController")]
	partial class PropertyFinderViewController
	{
		[Outlet]
		MonoTouch.UIKit.UIButton goButton { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIButton myLocationButton { get; set; }

		[Outlet]
		MonoTouch.UIKit.UITableView navigationTableView { get; set; }

		[Outlet]
		MonoTouch.UIKit.UITableView recentTableView { get; set; }

		[Outlet]
		MonoTouch.UIKit.UIActivityIndicatorView searchActivityIndicator { get; set; }

		[Outlet]
		MonoTouch.UIKit.UITextField searchLocationText { get; set; }

		[Outlet]
		MonoTouch.UIKit.UILabel userMessageLabel { get; set; }
		
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

			if (recentTableView != null) {
				recentTableView.Dispose ();
				recentTableView = null;
			}

			if (userMessageLabel != null) {
				userMessageLabel.Dispose ();
				userMessageLabel = null;
			}

			if (navigationTableView != null) {
				navigationTableView.Dispose ();
				navigationTableView = null;
			}
		}
	}
}
