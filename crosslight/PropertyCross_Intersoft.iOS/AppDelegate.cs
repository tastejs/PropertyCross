using Foundation;
using UIKit;
using IntersoftCore = Intersoft.Crosslight.iOS;
using Intersoft.Crosslight.iOS;

namespace PropertyCross_Intersoft.iOS
{
    // The main delegate for the application. This class is responsible for launching the 
    // User Interface of the application, as well as listening (and optionally responding) to 
    // application events from iOS.
    [Register("AppDelegate")]
    public partial class AppDelegate : UIPushApplicationDelegate
    {
        #region Methods

        protected override UIViewController WrapRootViewController(UIViewController contentViewController)
        {
            // This template doesn't use navigation controller, both login and main UI are root views
            // Return the content view directly

            if (contentViewController is UISplitViewController ||
                contentViewController is UITabBarController ||
                contentViewController is IDrawerNavigationController)
                return contentViewController;

            return new UINavigationController(contentViewController);
        }

        #endregion
    }
}