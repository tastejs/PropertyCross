package mono.android.support.v7.widget;


public class SearchView_OnCloseListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		android.support.v7.widget.SearchView.OnCloseListener
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onClose:()Z:GetOnCloseHandler:Android.Support.V7.Widget.SearchView/IOnCloseListenerInvoker, Xamarin.Android.Support.v7.AppCompat\n" +
			"";
		mono.android.Runtime.register ("Android.Support.V7.Widget.SearchView/IOnCloseListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", SearchView_OnCloseListenerImplementor.class, __md_methods);
	}


	public SearchView_OnCloseListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == SearchView_OnCloseListenerImplementor.class)
			mono.android.TypeManager.Activate ("Android.Support.V7.Widget.SearchView/IOnCloseListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public boolean onClose ()
	{
		return n_onClose ();
	}

	private native boolean n_onClose ();

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
