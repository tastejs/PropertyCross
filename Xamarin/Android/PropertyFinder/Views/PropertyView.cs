using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

using PropertyFinder.Model;
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	[Activity]			
	public class PropertyView : Activity, PropertyPresenter.View
	{		
		private PropertyPresenter presenter;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			SetContentView(Resource.Layout.property_view);

			var app = (PropertyFinderApplication)Application;
			presenter = (PropertyPresenter) app.Presenter;
			presenter.SetView(this);
		}

		public void SetProperty(Property property)
		{
		}

		private bool _fave;
		public bool IsFavourited
		{
			set { _fave = value; }
		}
		
		public event EventHandler ToggleFavourite;
	}
}

