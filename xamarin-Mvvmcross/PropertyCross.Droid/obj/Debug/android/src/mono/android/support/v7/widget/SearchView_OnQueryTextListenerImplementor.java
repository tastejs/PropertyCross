package mono.android.support.v7.widget;


public class SearchView_OnQueryTextListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		android.support.v7.widget.SearchView.OnQueryTextListener
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onQueryTextChange:(Ljava/lang/String;)Z:GetOnQueryTextChange_Ljava_lang_String_Handler:Android.Support.V7.Widget.SearchView/IOnQueryTextListenerInvoker, Xamarin.Android.Support.v7.AppCompat\n" +
			"n_onQueryTextSubmit:(Ljava/lang/String;)Z:GetOnQueryTextSubmit_Ljava_lang_String_Handler:Android.Support.V7.Widget.SearchView/IOnQueryTextListenerInvoker, Xamarin.Android.Support.v7.AppCompat\n" +
			"";
		mono.android.Runtime.register ("Android.Support.V7.Widget.SearchView/IOnQueryTextListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", SearchView_OnQueryTextListenerImplementor.class, __md_methods);
	}


	public SearchView_OnQueryTextListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == SearchView_OnQueryTextListenerImplementor.class)
			mono.android.TypeManager.Activate ("Android.Support.V7.Widget.SearchView/IOnQueryTextListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public boolean onQueryTextChange (java.lang.String p0)
	{
		return n_onQueryTextChange (p0);
	}

	private native boolean n_onQueryTextChange (java.lang.String p0);


	public boolean onQueryTextSubmit (java.lang.String p0)
	{
		return n_onQueryTextSubmit (p0);
	}

	private native boolean n_onQueryTextSubmit (java.lang.String p0);

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
