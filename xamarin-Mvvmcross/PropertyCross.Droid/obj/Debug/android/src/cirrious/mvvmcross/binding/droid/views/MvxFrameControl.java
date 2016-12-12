package cirrious.mvvmcross.binding.droid.views;


public class MvxFrameControl
	extends android.widget.FrameLayout
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onAttachedToWindow:()V:GetOnAttachedToWindowHandler\n" +
			"n_onDetachedFromWindow:()V:GetOnDetachedFromWindowHandler\n" +
			"";
		mono.android.Runtime.register ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFrameControl, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxFrameControl.class, __md_methods);
	}


	public MvxFrameControl (android.content.Context p0) throws java.lang.Throwable
	{
		super (p0);
		if (getClass () == MvxFrameControl.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFrameControl, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0 });
	}


	public MvxFrameControl (android.content.Context p0, android.util.AttributeSet p1) throws java.lang.Throwable
	{
		super (p0, p1);
		if (getClass () == MvxFrameControl.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFrameControl, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065", this, new java.lang.Object[] { p0, p1 });
	}


	public MvxFrameControl (android.content.Context p0, android.util.AttributeSet p1, int p2) throws java.lang.Throwable
	{
		super (p0, p1, p2);
		if (getClass () == MvxFrameControl.class)
			mono.android.TypeManager.Activate ("Cirrious.MvvmCross.Binding.Droid.Views.MvxFrameControl, Cirrious.MvvmCross.Binding.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Android.Content.Context, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:Android.Util.IAttributeSet, Mono.Android, Version=0.0.0.0, Culture=neutral, PublicKeyToken=84e04ff9cfb79065:System.Int32, mscorlib, Version=2.0.5.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e", this, new java.lang.Object[] { p0, p1, p2 });
	}


	public void onAttachedToWindow ()
	{
		n_onAttachedToWindow ();
	}

	private native void n_onAttachedToWindow ();


	public void onDetachedFromWindow ()
	{
		n_onDetachedFromWindow ();
	}

	private native void n_onDetachedFromWindow ();

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
