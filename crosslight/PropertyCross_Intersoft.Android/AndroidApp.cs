using System;
using System.Reflection;
using Android.App;
using Android.Runtime;
using Intersoft.Crosslight.Android;

namespace PropertyCross_Intersoft.Android
{
    [Application]
    public class AndroidApp : AndroidApplication
    {
        #region Constructors

        public AndroidApp(IntPtr intPtr, JniHandleOwnership jniHandleOwnership)
            : base(intPtr, jniHandleOwnership)
        {
        }

        #endregion

        #region Static Methods

        public static void PreserveAssembly(Assembly assembly)
        {
        }

        #endregion
    }
}