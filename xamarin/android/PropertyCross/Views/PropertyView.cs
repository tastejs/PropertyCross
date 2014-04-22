using System;
using System.Collections.Generic;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

using PropertyCross.Model;
using PropertyCross.Presenter;

using Com.Actionbarsherlock.App;
using Com.Actionbarsherlock.View;

using IMenu = global::Com.Actionbarsherlock.View.IMenu;
using IMenuItem = global::Com.Actionbarsherlock.View.IMenuItem;
using MenuItem = global::Com.Actionbarsherlock.View.MenuItem;
using MenuInflater = global::Com.Actionbarsherlock.View.MenuInflater;

namespace com.propertycross.xamarin.android.Views
{
	[Activity (ScreenOrientation = ScreenOrientation.Portrait)]				
	public class PropertyView : SherlockActivity, PropertyPresenter.View
	{		
		private PropertyPresenter presenter;
		private TextView priceText; 
		private TextView locationText;
		private ImageView propertyImage;
		private TextView overviewText;
		private TextView informationText;
		private Bitmap placeholder;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			SetContentView(Resource.Layout.property_view);

			SupportActionBar.Title = Resources.GetString(Resource.String.property_title);
			SupportActionBar.SetDisplayHomeAsUpEnabled(true);

			priceText = (TextView) FindViewById(Resource.Id.property_price);
			locationText = (TextView)FindViewById(Resource.Id.property_location);
			propertyImage = (ImageView) FindViewById(Resource.Id.property_image);
			overviewText = (TextView) FindViewById(Resource.Id.property_overview);
			informationText = (TextView) FindViewById(Resource.Id.property_information);

			placeholder = BitmapFactory.DecodeResource(Resources, Resource.Drawable.ic_launcher);

			var app = PropertyCrossApplication.GetApplication(this);
			presenter = (PropertyPresenter) app.Presenter;
			presenter.SetView(this);
			app.CurrentActivity = this;
		}

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			SupportMenuInflater.Inflate(Resource.Menu.favourites_toggle, menu);
			return true;
		}

		public override bool OnPrepareOptionsMenu(IMenu menu)
		{
			IMenuItem addItem = menu.FindItem(Resource.Id.favourites_add_item);
			addItem.SetVisible(!IsFavourited);

			IMenuItem removeItem = menu.FindItem(Resource.Id.favourites_remove_item);
			removeItem.SetVisible(IsFavourited);

			return true;
		}
		
		public override bool OnOptionsItemSelected(IMenuItem item)
		{
			if(item.ItemId == Android.Resource.Id.Home)
			{
				Finish();
				return true;
			}

			if( (item.ItemId == Resource.Id.favourites_add_item && !IsFavourited) ||
			   (item.ItemId == Resource.Id.favourites_remove_item && IsFavourited) )
			{
				ToggleFavourite(this, EventArgs.Empty);
				return true;
			}
			else
			{
				return base.OnOptionsItemSelected(item);
			}
		}

		public void SetProperty(Property property)
		{
			priceText.Text = property.FormattedPrice;
			locationText.Text = property.ShortTitle;

			BitmapUtils.Download(property.ImageUrl, propertyImage, Resources, placeholder);

			overviewText.Text = Java.Lang.String.Format(
				Resources.GetString(Resource.String.property_details),
				property.BedBathroomText,
				property.PropertyType);

			informationText.Text = property.Summary;
		}

		private bool _fave;
		public bool IsFavourited
		{
			get { return _fave; }
			set
			{
				_fave = value;
				SupportInvalidateOptionsMenu();
			}
		}
		
		public event EventHandler ToggleFavourite;
	}
}