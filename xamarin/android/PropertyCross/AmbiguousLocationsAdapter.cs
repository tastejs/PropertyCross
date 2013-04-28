using System;
using Android.Widget;
using PropertyFinder.Model;
using System.Collections.Generic;
using Android.Content;
using Android.Views;

namespace com.propertycross.xamarin.android
{
	public class AmbiguousLocationsAdapter : ArrayAdapter<Location>
	{
		private Context context;
		private IList<Location> items;

		public AmbiguousLocationsAdapter (Context c, IList<Location> items)
			: base(c, Android.Resource.Layout.SimpleListItem1, items)
		{
			this.context = c;
			this.items = items;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			View view = convertView;
			
			if(view == null)
			{
				LayoutInflater li = (LayoutInflater)context.GetSystemService(Context.LayoutInflaterService);
				view = li.Inflate(Android.Resource.Layout.SimpleListItem1, parent, false);
			}
			
			Location item = items[position];
			if (item != null) {
				TextView text = (TextView) view.FindViewById(Android.Resource.Id.Text1);
				text.Text = item.DisplayName;
			}

			return view;
		}
	}
}

