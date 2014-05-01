using System;
using MonoTouch.UIKit;

namespace PropertyCross
{
  public static class PlatformUtils
  {

    public static bool IsiOS7 {
      get { return UIDevice.CurrentDevice.CheckSystemVersion (7, 0); }
    }
  }
}

