package cirrious.mvvmcross.binding.droid.views;


public class MvxFilteringAdapter_MyFilter
	extends android.widget.Filter
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_performFiltering:(Ljava/lang/CharSequence;)Landroid/widget/Filter$FilterResults;:GetPerformFiltering_Ljava_lang_CharSequence_Handler\n" +
			"n_publishResults:(Ljava/lang/CharSequence;Landroid/widget/Filter$FilterResults;)V:GetPublishResults_Ljava_lang_CharSequence_Landroid_widget_Filter_FilterResults_Handler\n" +
			"n_convertResultToString:(Ljava/lang/Object;)Ljava/lang/CharSequence;:GetConvertResultToString_Ljava_lang_Object_Handler\n" +
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter/MyFilter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxFilteringAdapter_MyFilter.class, __md_methods);
	}


	public MvxFilteringAdapter_MyFilter () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxFilteringAdapter_MyFilter.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter/MyFilter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}

	public MvxFilteringAdapter_MyFilter (cirrious.mvvmcross.binding.droid.views.MvxFilteringAdapter p0) throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxFilteringAdapter_MyFilter.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter/MyFilter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", this, new java.lang.Object[] { p0 });
	}


	public android.widget.Filter.FilterResults performFiltering (java.lang.CharSequence p0)
	{
		return n_performFiltering (p0);
	}

	private native android.widget.Filter.FilterResults n_performFiltering (java.lang.CharSequence p0);


	public void publishResults (java.lang.CharSequence p0, android.widget.Filter.FilterResults p1)
	{
		n_publishResults (p0, p1);
	}

	private native void n_publishResults (java.lang.CharSequence p0, android.widget.Filter.FilterResults p1);


	public java.lang.CharSequence convertResultToString (java.lang.Object p0)
	{
		return n_convertResultToString (p0);
	}

	private native java.lang.CharSequence n_convertResultToString (java.lang.Object p0);

	java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}
