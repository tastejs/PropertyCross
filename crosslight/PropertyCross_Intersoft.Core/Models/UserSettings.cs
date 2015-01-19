using Intersoft.Crosslight.Data.ComponentModel;
using Intersoft.Crosslight.Data.EntityModel;

namespace PropertyCross_Intersoft.Models
{
    public class UserSettings : EntityBase
    {
        #region Constructors

        public UserSettings()
        {
            this.AutoRefresh = true;
            this.EnableNotification = true;
            this.EnableInAppSound = true;
            this.SyncInterval = 15;
            this.TextSize = TextSize.Medium;
        }

        #endregion

        #region Constants

        public static EntityProperty AutoRefreshPropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, bool>("AutoRefresh", false));

        public static EntityProperty EnableInAppSoundPropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, bool>("EnableInAppSound", false));

        public static EntityProperty EnableInAppVibratePropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, bool>("EnableInAppVibrate", false));

        public static EntityProperty EnableNotificationPropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, bool>("EnableNotification", false));

        public static EntityProperty SyncIntervalPropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, int>("SyncInterval", false));

        public static EntityProperty TextSizePropertyMetadata =
            EntityMetadata.Register(new DataEntityProperty<UserSettings, TextSize>("TextSize", false));

        #endregion

        #region Properties

        public bool AutoRefresh
        {
            get { return (bool)this.GetValue(AutoRefreshPropertyMetadata); }
            set { this.SetValue(AutoRefreshPropertyMetadata, value); }
        }

        public bool EnableInAppSound
        {
            get { return (bool)this.GetValue(EnableInAppSoundPropertyMetadata); }
            set { this.SetValue(EnableInAppSoundPropertyMetadata, value); }
        }

        public bool EnableInAppVibrate
        {
            get { return (bool)this.GetValue(EnableInAppVibratePropertyMetadata); }
            set { this.SetValue(EnableInAppVibratePropertyMetadata, value); }
        }

        public bool EnableNotification
        {
            get { return (bool)this.GetValue(EnableNotificationPropertyMetadata); }
            set { this.SetValue(EnableNotificationPropertyMetadata, value); }
        }

        [Range(0, 100)]
        public int SyncInterval
        {
            get { return (int)this.GetValue(SyncIntervalPropertyMetadata); }
            set { this.SetValue(SyncIntervalPropertyMetadata, value); }
        }

        public TextSize TextSize
        {
            get { return (TextSize)this.GetValue(TextSizePropertyMetadata); }
            set { this.SetValue(TextSizePropertyMetadata, value); }
        }

        #endregion
    }

    public enum TextSize
    {
        Small,
        Medium,
        Large,
        ExtraLarge
    }
}