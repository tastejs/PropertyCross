using System;
using System.Collections.Generic;
using System.Linq;

using MonoTouch.Foundation;
using MonoTouch.UIKit;

using PropertyFinder.Model;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	// The UIApplicationDelegate for the application. This class is responsible for launching the 
	// User Interface of the application, as well as listening (and optionally responding) to 
	// application events from iOS.
	[Register ("AppDelegate")]
	public partial class AppDelegate : UIApplicationDelegate
	{
		// class-level declarations
		UIWindow window;
		UINavigationController navigationController;
		
		//
		// This method is invoked when the application has loaded and is ready to run. In this 
		// method you should instantiate the window, load the UI into it and then make the window
		// visible.
		//
		// You have 17 seconds to return from this method, or iOS will terminate your application.
		//
		public override bool FinishedLaunching (UIApplication app, NSDictionary options)
		{
			window = new UIWindow (UIScreen.MainScreen.Bounds);

      navigationController = new UINavigationController ();

      var source = new PropertyDataSource (new JsonWebPropertySearch (new MarshalInvokeService()));
      var geolocationService = new GeoLocationService ();
        
      var statePersistence = new StatePersistenceService ();
      PropertyFinderPersistentState state = statePersistence.LoadState ();

      var presenter = new PropertyFinderPresenter (state, source,
              new NavigationService (navigationController), geolocationService);
  		var controller = new PropertyFinderViewController (presenter);
 			
      navigationController.PushViewController(controller, false);
			window.RootViewController = navigationController;

			// make the window visible
			window.MakeKeyAndVisible ();
			
			return true;
		}
	}
}

