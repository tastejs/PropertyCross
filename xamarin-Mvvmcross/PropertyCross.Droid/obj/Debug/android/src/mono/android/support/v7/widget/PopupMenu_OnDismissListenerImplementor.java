package mono.android.support.v7.widget;


public class PopupMenu_OnDismissListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		android.support.v7.widget.PopupMenu.OnDismissListener
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onDismiss:(Landroid/support/v7/widget/PopupMenu;)V:GetOnDismiss_Landroid_support_v7_widget_PopupMenu_Handler:Android.Support.V7.Widget.PopupMenu/IOnDismissListenerInvoker, Xamarin.Android.Support.v7.AppCompat\n" +
			"";
		mono.android.Runtime.register ("Android.Support.V7.Widget.PopupMenu/IOnDismissListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", PopupMenu_OnDismissListenerImplementor.class, __md_methods);
	}


	public PopupMenu_OnDismissListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == PopupMenu_OnDismissListenerImplementor.class)
			mono.android.TypeManager.Activate ("Android.Support.V7.Widget.PopupMenu/IOnDismissListenerImplementor, Xamarin.Android.Support.v7.AppCompat, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onDismiss (android.support.v7.widget.PopupMenu p0)
	{
		n_onDismiss (p0);
	}

	private native void n_onDismiss (android.support.v7.widget.PopupMenu p0);

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
