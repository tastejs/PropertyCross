using System;
using PropertyCross_Intersoft.ViewModels;
using Intersoft.Crosslight;

namespace PropertyCross_Intersoft
{
    public static class ViewModelExtensions
    {
        #region Static Methods

        public static string GetExceptionMessage(this Exception exception)
        {
            string exceptionMessage = exception.Message;

            if (string.IsNullOrEmpty(exceptionMessage) && exception.InnerException != null)
                exceptionMessage = exception.InnerException.Message;

            return exceptionMessage.Replace("\"", "");
        }

        public static void NavigateToMainViewModel(this INavigable viewModel)
        {
            viewModel.NavigationService.Navigate<PropertySearchViewModel>();
        }

        #endregion
    }
}