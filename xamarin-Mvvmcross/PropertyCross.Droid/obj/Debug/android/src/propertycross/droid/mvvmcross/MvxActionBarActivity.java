package propertycross.droid.mvvmcross;


public abstract class MvxActionBarActivity
	extends propertycross.droid.mvvmcross.MvxActionBarEventSourceActivity
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_setContentView:(I)V:GetSetContentView_IHandler\n" +
			"";
		mono.android.Runtime.register ("PropertyCross.Droid.MvvmCross.MvxActionBarActivity, PropertyCross.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxActionBarActivity.class, __md_methods);
	}


	public MvxActionBarActivity () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxActionBarActivity.class)
			mono.android.TypeManager.Activate ("PropertyCross.Droid.MvvmCross.MvxActionBarActivity, PropertyCross.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void setContentView (int p0)
	{
		n_setContentView (p0);
	}

	private native void n_setContentView (int p0);

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
