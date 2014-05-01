// WARNING
//
// This file has been generated automatically by MonoDevelop to store outlets and
// actions made in the Xcode designer. If it is removed, they will be lost.
// Manual changes to this file may not be handled correctly.
//
using MonoTouch.Foundation;

namespace PropertyCross
{
	[Register ("SearchResultsViewController")]
	partial class SearchResultsViewController
	{
		[Outlet]
		MonoTouch.UIKit.UITableView searchResultsTable { get; set; }
		
		void ReleaseDesignerOutlets ()
		{
			if (searchResultsTable != null) {
				searchResultsTable.Dispose ();
				searchResultsTable = null;
			}
		}
	}
}
