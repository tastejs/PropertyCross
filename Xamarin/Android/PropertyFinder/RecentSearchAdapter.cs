
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
using PropertyFinder.Presenter;

namespace PropertyFinder
{
	public class RecentSearchAdapter : ArrayAdapter<RecentSearch>
	{
		private Context context;

		public RecentSearchAdapter (Context c, IList<RecentSearch> d)
		: base(c, Android.Resource.Layout.SimpleListItem1, d)
		{
		}

		/*public override int Count
		{
			get { return data.Count; }
		}

		public override View GetView (int position, View convertView, ViewGroup parent)
		{
			View view = convertView;
			if (view == null)
			{
				LayoutInflater li = (LayoutInflater) context.GetSystemService(Context.LayoutInflaterService);
				view = li.Inflate(Resource.Layout.recent_search_row, parent, false);
			}

			RecentSearch item = data[position];
			if(item != null)
			{
				TextView searchText = (TextView) view.FindViewById(Resource.Id.recent_search_text);
				TextView count = (TextView) view.FindViewById(Resource.Id.recent_search_count);

				searchText.SetText(item.Search.ToString(), TextView.BufferType.Normal);

				String c = String.Format(context.Resources.GetString(Resource.String.recent_searches_count_format),
				              item.ResultsCount);
				count.SetText(c, TextView.BufferType.Normal);
			}

			return view;
		}*/
	}
}
