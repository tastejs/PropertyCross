using Cirrious.MvvmCross.ViewModels;

namespace PropertyCross.Core.ViewModels
{
    public class ViewModelBase : MvxViewModel
    {
        private bool _isBusy;

        public bool IsBusy
        {
            get { return _isBusy; }
            set { _isBusy = value; RaisePropertyChanged(() => IsBusy); }
        }
    }
}