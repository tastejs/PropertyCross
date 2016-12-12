package mono.android.support.v4.app;


public class FragmentManager_OnBackStackChangedListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		android.support.v4.app.FragmentManager.OnBackStackChangedListener
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onBackStackChanged:()V:GetOnBackStackChangedHandler:Android.Support.V4.App.FragmentManager/IOnBackStackChangedListenerInvoker, Xamarin.Android.Support.v4\n" +
			"";
		mono.android.Runtime.register ("Android.Support.V4.App.FragmentManager/IOnBackStackChangedListenerImplementor, Xamarin.Android.Support.v4, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", FragmentManager_OnBackStackChangedListenerImplementor.class, __md_methods);
	}


	public FragmentManager_OnBackStackChangedListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == FragmentManager_OnBackStackChangedListenerImplementor.class)
			mono.android.TypeManager.Activate ("Android.Support.V4.App.FragmentManager/IOnBackStackChangedListenerImplementor, Xamarin.Android.Support.v4, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onBackStackChanged ()
	{
		n_onBackStackChanged ();
	}

	private native void n_onBackStackChanged ();

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
