using System;
using Android.Widget;
using Android.Graphics.Drawables;
using Android.Graphics;
using Android.Content.Res;

namespace PropertyFinder
{
	public static class BitmapUtils
	{
		public static void Download(string url, ImageView imageView, Resources resources, Bitmap placeholder)
		{
			if(CancelPotentialDownload(url, imageView))
			{
				var task = new DownloadImageTask(imageView);
				var drawable = new AsyncDrawable(resources, placeholder, task);
				imageView.SetImageDrawable(drawable);
				task.Execute(url);
			}
		}

		private static bool CancelPotentialDownload(string url, ImageView imageView)
		{
			DownloadImageTask task = GetTask(imageView);
			if (task != null)
			{
				string bitmapData = task.Url;
				if (bitmapData != url)
				{
					task.Cancel(true);
				}
				else
				{
					return false;
				}
			}
			return true;
		}

		public static DownloadImageTask GetTask(ImageView imageView)
		{
			if (imageView != null)
			{
				Drawable drawable = imageView.Drawable;
				if (drawable is AsyncDrawable)
				{
					return ((AsyncDrawable) drawable).GetTask();
				}
			}
			return null;
		}
	}
}

