using System.Windows.Input;
using Cirrious.MvvmCross.WindowsPhone.Views;
using PropertyCross.Core.ViewModels;

namespace PropertyCross.WindowsPhone.Views
{
    public partial class PropertyFinderView : MvxPhonePage
    {
        public PropertyFinderView()
        {
            InitializeComponent();
        }

        public PropertyFinderViewModel ViewModel { get { return (PropertyFinderViewModel) DataContext; } }

        private void SearchText_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                ViewModel.SearchCommand.Execute(null);
            }
        }
    }
}