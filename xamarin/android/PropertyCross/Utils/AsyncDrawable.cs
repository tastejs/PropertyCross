using System;
using Android.Graphics.Drawables;
using Android.Content.Res;
using Android.Graphics;

namespace com.propertycross.xamarin.android
{
	public class AsyncDrawable : BitmapDrawable
	{
		private WeakReference taskRef;

		public AsyncDrawable(Resources resources, Bitmap bitmap, DownloadImageTask task)
			: base(resources, bitmap)
		{
			taskRef = new WeakReference(task);
		}

		public DownloadImageTask GetTask()
		{
			return (DownloadImageTask) taskRef.Target;
		}
	}
}

