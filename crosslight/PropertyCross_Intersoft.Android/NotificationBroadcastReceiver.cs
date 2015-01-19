using Android.App;
using Android.Content;
using Intersoft.Crosslight.Services.PushNotification.Android;

namespace PropertyCross_Intersoft.Android
{
    /// <summary>
    /// Represents application google cloud messaging broadcast receiver.
    /// </summary>
    [BroadcastReceiver(Permission = "com.google.android.c2dm.permission.SEND")]
    [IntentFilter(new[] { "com.google.android.c2dm.intent.RECEIVE" }, Categories = new[] { "@PACKAGE_NAME@" })]
    [IntentFilter(new[] { "com.google.android.c2dm.intent.REGISTRATION" }, Categories = new[] { "@PACKAGE_NAME@" })]
    [IntentFilter(new[] { "com.google.android.gcm.intent.RETRY" }, Categories = new[] { "@PACKAGE_NAME@" })]
    public class NotificationBroadcastReceiver : GoogleCloudMessagingBroadcastReceiver
    {
        #region Properties

        /// <summary>
        /// Gets or sets the notification icon identifier.
        /// </summary>
        /// <value>
        /// The notification icon identifier.
        /// </value>
        public override int NotificationIconId
        {
            get { return Resource.Drawable.icon; }
        }

        #endregion
    }
}