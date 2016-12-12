package cirrious.mvvmcross.binding.droid.views;


public class MvxSpinner
	extends android.widget.Spinner
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxSpinner.class, __md_methods);
	}


	public MvxSpinner (android.content.Context p0) throws java.lang.Throwable
	{
		super (p0);
		if (getClass () == MvxSpinner.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0 });
	}


	public MvxSpinner (android.content.Context p0, android.util.AttributeSet p1) throws java.lang.Throwable
	{
		super (p0, p1);
		if (getClass () == MvxSpinner.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0, p1 });
	}


	public MvxSpinner (android.content.Context p0, android.util.AttributeSet p1, int p2) throws java.lang.Throwable
	{
		super (p0, p1, p2);
		if (getClass () == MvxSpinner.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:System.Int32, mscorlib, Version=2.0.5.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e", this, new java.lang.Object[] { p0, p1, p2 });
	}


	public MvxSpinner (android.content.Context p0, android.util.AttributeSet p1, int p2, int p3) throws java.lang.Throwable
	{
		super (p0, p1, p2, p3);
		if (getClass () == MvxSpinner.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:System.Int32, mscorlib, Version=2.0.5.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e:Android.Widget.SpinnerMode, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0, p1, p2, p3 });
	}


	public MvxSpinner (android.content.Context p0, int p1) throws java.lang.Throwable
	{
		super (p0, p1);
		if (getClass () == MvxSpinner.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxSpinner, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Widget.SpinnerMode, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0, p1 });
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
