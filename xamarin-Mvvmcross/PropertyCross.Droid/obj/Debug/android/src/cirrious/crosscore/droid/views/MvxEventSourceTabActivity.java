package cirrious.crosscore.droid.views;


public abstract class MvxEventSourceTabActivity
	extends android.app.TabActivity
	implements
		mono.android.IGCUserPeer
{
	static final String __md_methods;
	static {
		__md_methods = 
			"n_onCreate:(Landroid/os/Bundle;)V:GetOnCreate_Landroid_os_Bundle_Handler\n" +
			"n_onDestroy:()V:GetOnDestroyHandler\n" +
			"n_onNewIntent:(Landroid/content/Intent;)V:GetOnNewIntent_Landroid_content_Intent_Handler\n" +
			"n_onResume:()V:GetOnResumeHandler\n" +
			"n_onPause:()V:GetOnPauseHandler\n" +
			"n_onStart:()V:GetOnStartHandler\n" +
			"n_onRestart:()V:GetOnRestartHandler\n" +
			"n_onStop:()V:GetOnStopHandler\n" +
			"n_onSaveInstanceState:(Landroid/os/Bundle;)V:GetOnSaveInstanceState_Landroid_os_Bundle_Handler\n" +
			"n_startActivityForResult:(Landroid/content/Intent;I)V:GetStartActivityForResult_Landroid_content_Intent_IHandler\n" +
			"n_onActivityResult:(IILandroid/content/Intent;)V:GetOnActivityResult_IILandroid_content_Intent_Handler\n" +
			"";
		mono.android.Runtime.register ("Cirrious.CrossCore.Droid.Views.MvxEventSourceTabActivity, Cirrious.CrossCore.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", MvxEventSourceTabActivity.class, __md_methods);
	}


	public MvxEventSourceTabActivity () throws java.lang.Throwable
	{
		super ();
		if (getClass () == MvxEventSourceTabActivity.class)
			mono.android.TypeManager.Activate ("Cirrious.CrossCore.Droid.Views.MvxEventSourceTabActivity, Cirrious.CrossCore.Droid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void onCreate (android.os.Bundle p0)
	{
		n_onCreate (p0);
	}

	private native void n_onCreate (android.os.Bundle p0);


	public void onDestroy ()
	{
		n_onDestroy ();
	}

	private native void n_onDestroy ();


	public void onNewIntent (android.content.Intent p0)
	{
		n_onNewIntent (p0);
	}

	private native void n_onNewIntent (android.content.Intent p0);


	public void onResume ()
	{
		n_onResume ();
	}

	private native void n_onResume ();


	public void onPause ()
	{
		n_onPause ();
	}

	private native void n_onPause ();


	public void onStart ()
	{
		n_onStart ();
	}

	private native void n_onStart ();


	public void onRestart ()
	{
		n_onRestart ();
	}

	private native void n_onRestart ();


	public void onStop ()
	{
		n_onStop ();
	}

	private native void n_onStop ();


	public void onSaveInstanceState (android.os.Bundle p0)
	{
		n_onSaveInstanceState (p0);
	}

	private native void n_onSaveInstanceState (android.os.Bundle p0);


	public void startActivityForResult (android.content.Intent p0, int p1)
	{
		n_startActivityForResult (p0, p1);
	}

	private native void n_startActivityForResult (android.content.Intent p0, int p1);


	public void onActivityResult (int p0, int p1, android.content.Intent p2)
	{
		n_onActivityResult (p0, p1, p2);
	}

	private native void n_onActivityResult (int p0, int p1, android.content.Intent p2);

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
