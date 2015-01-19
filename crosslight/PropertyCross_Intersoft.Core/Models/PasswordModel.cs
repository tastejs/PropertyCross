using Intersoft.AppFramework.Models;
using Intersoft.Crosslight.Data.ComponentModel;

namespace PropertyCross_Intersoft.Models
{
    public class PasswordModel : ModelBase
    {
        #region Fields

        private string _currentPassword;
        private string _newPassword;
        private string _verifyNewPassword;

        #endregion

        #region Properties

        [Required(ErrorMessage = "Current password is required.")]
        public string CurrentPassword
        {
            get { return _currentPassword; }
            set
            {
                if (_currentPassword != value)
                {
                    _currentPassword = value;
                    this.OnPropertyChanged("CurrentPassword");
                }
            }
        }

        [Required(ErrorMessage = "New password is required.")]
        [Password(ErrorMessage = "Your new password is not strong enough.")]
        public string NewPassword
        {
            get { return _newPassword; }
            set
            {
                if (_newPassword != value)
                {
                    _newPassword = value;
                    this.OnPropertyChanged("NewPassword");
                }
            }
        }

        [Required(ErrorMessage = "Please verify your new password.")]
        [VerifyPassword(PasswordProperty = "NewPassword")]
        public string VerifyNewPassword
        {
            get { return _verifyNewPassword; }
            set
            {
                if (_verifyNewPassword != value)
                {
                    _verifyNewPassword = value;
                    this.OnPropertyChanged("VerifyNewPassword");
                }
            }
        }

        #endregion
    }
}