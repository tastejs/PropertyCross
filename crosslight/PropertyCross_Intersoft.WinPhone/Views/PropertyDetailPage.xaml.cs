using Intersoft.Crosslight.WinPhone;
using PropertyCross_Intersoft.ViewModels;
using Intersoft.Crosslight;
using System.Windows.Navigation;
using System.ComponentModel;
using Microsoft.Phone.Shell;
using System;

namespace PropertyCross_Intersoft.WinPhone
{
    [ViewModelType(typeof(PropertyDetailViewModel))]
    public partial class PropertyDetailPage : PhoneApplicationPage
    {
        public PropertyDetailPage()
        {
            InitializeComponent();
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
        }
        private PropertyDetailViewModel ViewModel
        {
            get { return (PropertyDetailViewModel)DataContext; }
        }

        private void OnItemPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if(e.PropertyName=="IsFavorite")
            {
                this.UpdateButtonState();
            }
        }
        protected override void InitializeView()
        {
            base.InitializeView();

            ViewModel.Item.PropertyChanged += OnItemPropertyChanged;
            UpdateButtonState();
        }

        private void UpdateButtonState()
        {
            var btn = (ApplicationBarIconButton)ApplicationBar.Buttons[0];
            if (!ViewModel.Item.IsFavorite)
            {
                btn.IconUri = new Uri("/Assets/Images/addToFavourites.png", UriKind.Relative);
                btn.Text = "add favourite";
            }
            else
            {
                btn.IconUri = new Uri("/Assets/Images/favourited.png", UriKind.Relative);
                btn.Text = "remove favourite";
            }  
        }
        protected override void Dispose(bool isDisposing)
        {
            if(isDisposing)
            {
                this.ViewModel.Item.PropertyChanged -= OnItemPropertyChanged;
            }
            base.Dispose(isDisposing);
        }
    }
}