
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

namespace PropertyFinder
{
	public class SearchResultsAdapter : ArrayAdapter<Property>
	{
		private Context context;
		private IList<Property> data;
		
		public SearchResultsAdapter (Context c, IList<Property> d)
			: base(c, Android.Resource.Layout.SimpleListItem1, d)
		{
			this.context = c;
			this.data = d;
		}

		public override int Count
		{
			get { return data.Count; }
		}
		
		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			View view = convertView;
			PropertySearchHolder holder;
			
			if(view == null)
			{
				LayoutInflater li = (LayoutInflater)context.GetSystemService(Context.LayoutInflaterService);
				view = li.Inflate(Resource.Layout.property_search_row, parent, false);
				
				holder = new PropertySearchHolder()
				{
					PriceText = (TextView) view.FindViewById(Resource.Id.property_search_price),
					DetailsText = (TextView) view.FindViewById(Resource.Id.property_search_details)
				};
				view.SetTag(Resource.Layout.recent_search_row, holder);
			}
			else
			{
				holder = (PropertySearchHolder) view.GetTag(Resource.Layout.recent_search_row);
			}
			
			Property item = data[position];
			holder.PriceText.Text = item.FormattedPrice;
			
			holder.DetailsText.Text = item.Summary;
			
			return view;
		}
		
		private class PropertySearchHolder : Java.Lang.Object
		{
			public TextView PriceText { get; set; }
			public TextView DetailsText { get; set; }
		}
	}
}

