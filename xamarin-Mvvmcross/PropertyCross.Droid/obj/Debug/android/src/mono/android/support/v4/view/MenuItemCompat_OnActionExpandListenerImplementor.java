package mono.android.support.v4.view;


public class MenuItemCompat_OnActionExpandListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		android.support.v4.view.MenuItemCompat.OnActionExpandListener
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onMenuItemActionCollapse:(Landroid/view/MenuItem;)Z:GetOnMenuItemActionCollapse_Landroid_view_MenuItem_Handler:Android.Support.V4.View.MenuItemCompat/IOnActionExpandListenerInvoker, Xamarin.Android.Support.v4\n" +
			"n_onMenuItemActionExpand:(Landroid/view/MenuItem;)Z:GetOnMenuItemActionExpand_Landroid_view_MenuItem_Handler:Android.Support.V4.View.MenuItemCompat/IOnActionExpandListenerInvoker, Xamarin.Android.Support.v4\n" +
			"";
		mono.android.Runtime.register ("Android.Support.V4.View.MenuItemCompat/IOnActionExpandListenerImplementor, Xamarin.Android.Support.v4, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MenuItemCompat_OnActionExpandListenerImplementor.class, __md_methods);
	}


	public MenuItemCompat_OnActionExpandListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MenuItemCompat_OnActionExpandListenerImplementor.class)
			mono.android.TypeManager.Activate ("Android.Support.V4.View.MenuItemCompat/IOnActionExpandListenerImplementor, Xamarin.Android.Support.v4, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public boolean onMenuItemActionCollapse (android.view.MenuItem p0)
	{
		return n_onMenuItemActionCollapse (p0);
	}

	private native boolean n_onMenuItemActionCollapse (android.view.MenuItem p0);


	public boolean onMenuItemActionExpand (android.view.MenuItem p0)
	{
		return n_onMenuItemActionExpand (p0);
	}

	private native boolean n_onMenuItemActionExpand (android.view.MenuItem p0);

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
