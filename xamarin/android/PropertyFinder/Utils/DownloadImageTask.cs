using System;
using Android.OS;
using Android.Widget;
using Android.Graphics;
using System.Net;
using System.IO;

namespace PropertyFinder
{
	public class DownloadImageTask : AsyncTask
	{
		private WeakReference imgRef;

		public String Url
		{
			get;
			private set;
		}

		public DownloadImageTask(ImageView image)
		{
			imgRef = new WeakReference(image);
		}

		protected override Java.Lang.Object DoInBackground(params Java.Lang.Object[] args)
		{
			Url = args[0].ToString();
			Bitmap bitmap = null;
			try
			{
				HttpWebRequest request = (HttpWebRequest) WebRequest.Create(Url);
				HttpWebResponse response = (HttpWebResponse) request.GetResponse();

				using(Stream s = response.GetResponseStream())
				{
					bitmap = BitmapFactory.DecodeStream(s);
				}
			}
			catch(Exception e)
			{
				// log
			}
			return bitmap;
		}

		protected override void OnPostExecute(Java.Lang.Object result)
		{
			Bitmap bitmap = result as Bitmap;

			if (IsCancelled)
			{
				bitmap = null;
			}
			if (imgRef != null && bitmap != null)
			{
				ImageView img = (ImageView) imgRef.Target;
				DownloadImageTask task = BitmapUtils.GetTask(img);

				if(this == task && img != null)
				{
					img.SetImageBitmap(bitmap);
				}
			}
		}
	}
}

