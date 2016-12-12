package cirrious.mvvmcross.droid.simple;


public class MvxSimpleBindingActivity
	extends cirrious.mvvmcross.droid.views.MvxActivity
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Droid.Simple.MvxSimpleBindingActivity, Cirrious.MvvmCross.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxSimpleBindingActivity.class, __md_methods);
	}


	public MvxSimpleBindingActivity () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxSimpleBindingActivity.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Droid.Simple.MvxSimpleBindingActivity, Cirrious.MvvmCross.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}

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
