using System;
using Android.Widget;
using Android.Graphics.Drawables;

namespace PropertyFinder
{
	public static class BitmapUtils
	{
		public static bool CancelPotentialDownload(string url, ImageView imageView)
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

