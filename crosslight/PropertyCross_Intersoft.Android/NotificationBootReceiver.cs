using Android.App;
using Android.Content;
using Intersoft.Crosslight.Services.PushNotification.Android;

namespace PropertyCross_Intersoft.Android
{
    /// <summary>
    /// Represents application google cloud messaging boot receiver.
    /// </summary>
    [BroadcastReceiver]
    [IntentFilter(new[] { Intent.ActionBootCompleted })]
    [IntentFilter(new[] { Intent.ActionUserPresent })]
    public class NotificationBootReceiver : GoogleCloudMessagingBootReceiver
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