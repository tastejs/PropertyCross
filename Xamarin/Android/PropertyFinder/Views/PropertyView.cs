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
using Android.Support.V4.App;
using Android.Graphics;

namespace PropertyFinder
{
	[Activity]			
	public class PropertyView : Activity, PropertyPresenter.View
	{		
		private PropertyPresenter presenter;
		private TextView priceText;
		private TextView locationText;
		private ImageView propertyImage;
		private TextView summaryText;
		private Bitmap placeholder;

		protected override void OnCreate(Bundle bundle)
		{
			base.OnCreate(bundle);

			SetContentView(Resource.Layout.property_view);
			priceText = (TextView) FindViewById(Resource.Id.property_price);
			locationText = (TextView) FindViewById(Resource.Id.property_location);
			propertyImage = (ImageView) FindViewById(Resource.Id.property_image);
			summaryText = (TextView) FindViewById(Resource.Id.property_details);

			placeholder = BitmapFactory.DecodeResource(Resources, Resource.Drawable.Icon);

			var app = (PropertyFinderApplication)Application;
			presenter = (PropertyPresenter) app.Presenter;
			presenter.SetView(this);
		}

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			MenuInflater.Inflate(Resource.Menu.favourites_toggle, menu);
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

			var task = new DownloadImageTask(propertyImage);
			task.Execute(property.ImageUrl);

			summaryText.Text = Java.Lang.String.Format(
				Resources.GetString(Resource.String.property_details),
				property.Bedrooms,
				property.PropertyType);
		}

		private bool _fave;
		public bool IsFavourited
		{
			get { return _fave; }
			set
			{
				_fave = value;
				ActivityCompat.InvalidateOptionsMenu(this);
			}
		}
		
		public event EventHandler ToggleFavourite;
	}
}

