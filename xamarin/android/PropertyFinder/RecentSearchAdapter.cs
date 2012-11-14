
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
		private IList<RecentSearch> data;

		public RecentSearchAdapter (Context c, IList<RecentSearch> d)
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
			RecentSearchHolder holder;

			if(view == null)
			{
				LayoutInflater li = (LayoutInflater)context.GetSystemService(Context.LayoutInflaterService);
				view = li.Inflate(Resource.Layout.recent_search_row, parent, false);

				holder = new RecentSearchHolder()
				{
					SearchText = (TextView) view.FindViewById(Resource.Id.recent_search_text),
					ResultsCount = (TextView) view.FindViewById(Resource.Id.recent_search_count)
				};
				view.SetTag(Resource.Layout.recent_search_row, holder);
			}
			else
			{
				holder = (RecentSearchHolder) view.GetTag(Resource.Layout.recent_search_row);
			}

			RecentSearch item = data[position];
			holder.SearchText.SetText(item.Search.DisplayText, TextView.BufferType.Normal);

				String c = Java.Lang.String.Format(context.Resources.GetString(Resource.String.recent_searches_count_format),
				              item.ResultsCount);
			holder.ResultsCount.SetText(c, TextView.BufferType.Normal);

			return view;
		}

		private class RecentSearchHolder : Java.Lang.Object
		{
			public TextView SearchText { get; set; }
			public TextView ResultsCount { get; set; }
		}
	}
}
