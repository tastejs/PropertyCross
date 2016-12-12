package cirrious.mvvmcross.binding.droid.views;


public class MvxRadioGroup
	extends android.widget.RadioGroup
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Binding.Droid.Views.MvxRadioGroup, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxRadioGroup.class, __md_methods);
	}


	public MvxRadioGroup (android.content.Context p0) throws java.lang.Throwable
	{
		super (p0);
		if (getClass () == MvxRadioGroup.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxRadioGroup, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0 });
	}


	public MvxRadioGroup (android.content.Context p0, android.util.AttributeSet p1) throws java.lang.Throwable
	{
		super (p0, p1);
		if (getClass () == MvxRadioGroup.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxRadioGroup, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0, p1 });
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
