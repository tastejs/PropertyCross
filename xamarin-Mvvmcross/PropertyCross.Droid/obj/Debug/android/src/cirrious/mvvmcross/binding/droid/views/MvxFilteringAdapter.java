package cirrious.mvvmcross.binding.droid.views;


public class MvxFilteringAdapter
	extends cirrious.mvvmcross.binding.droid.views.MvxAdapter
	implements
		mono.android.IGCUserPeer,
		android.widget.Filterable
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_notifyDataSetChanged:()V:GetNotifyDataSetChangedHandler\n" +
			"n_getItem:(I)Ljava/lang/Object;:GetGetItem_IHandler\n" +
			"n_getFilter:()Landroid/widget/Filter;:GetGetFilterHandler:Android.Widget.IFilterableInvoker, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null\n" +
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxFilteringAdapter.class, __md_methods);
	}


	public MvxFilteringAdapter () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxFilteringAdapter.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}

	public MvxFilteringAdapter (android.content.Context p0) throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxFilteringAdapter.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFilteringAdapter, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0 });
	}


	public void notifyDataSetChanged ()
	{
		n_notifyDataSetChanged ();
	}

	private native void n_notifyDataSetChanged ();


	public java.lang.Object getItem (int p0)
	{
		return n_getItem (p0);
	}

	private native java.lang.Object n_getItem (int p0);


	public android.widget.Filter getFilter ()
	{
		return n_getFilter ();
	}

	private native android.widget.Filter n_getFilter ();

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
