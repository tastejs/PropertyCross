using Android.App;
using Android.OS;
using Android.Views;
using Cirrious.MvvmCross.Binding.BindingContext;
using PropertyCross.Core.ViewModels;
using PropertyCross.Droid.MvvmCross;

namespace PropertyCross.Droid.Views
{
    public class MvxActionBarBusyActivity : MvxActionBarActivity
    {
        protected bool _isBusy;
        public bool IsBusy
        {
            get { return _isBusy; }
            set
            {
                _isBusy = value;
                SetProgressBarIndeterminateVisibility(value);

            }
        }
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);  

            SupportRequestWindowFeature((int)WindowFeatures.IndeterminateProgress);

            SetSupportProgressBarIndeterminate(true);

            var set = this.CreateBindingSet<MvxActionBarBusyActivity, ViewModelBase>();
            set.Bind(this).For(prop => prop.IsBusy).To(vm => vm.IsBusy).OneWay();
            set.Apply();   
        }
    }
}