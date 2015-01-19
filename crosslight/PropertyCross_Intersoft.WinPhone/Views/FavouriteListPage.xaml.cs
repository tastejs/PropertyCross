using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using PropertyCross_Intersoft.ViewModels;
using Intersoft.Crosslight;
using Intersoft.Crosslight.WinPhone;
using PropertyCross_Intersoft.Models;
namespace PropertyCross_Intersoft.WinPhone.Views
{
    [ViewModelType(typeof(FavouriteListViewModel))]
    public partial class FavouriteListPage : PhoneApplicationPage
    {
        public FavouriteListPage()
        {
            InitializeComponent();
        }

    }
}