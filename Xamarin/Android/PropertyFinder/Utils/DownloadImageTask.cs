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
		private ImageView img;

		public DownloadImageTask(ImageView image)
		{
			img = image;
		}

		protected override Java.Lang.Object DoInBackground(params Java.Lang.Object[] args)
		{
			String url = args[0].ToString();
			Bitmap bitmap = null;
			try
			{
				HttpWebRequest request = (HttpWebRequest) WebRequest.Create(url);
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
			img.SetImageBitmap(result as Bitmap);
		}
	}
}

