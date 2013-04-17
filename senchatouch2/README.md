## Building

We have been unable to get the successfully produce a native package using the [native packaging guide](http://docs.sencha.com/touch/2-0/#!/guide/native_packaging) so have opted to build the native binary using PhoneGap instead. N.B. This doesn't seem to be an uncommon approach from a quick search of their forums but we would ideally use their tooling if it worked. For Windows Phone PhoneGap is the recommended packaging method.

* Install the [Sencha Cmd Tool](http://www.sencha.com/products/sencha-cmd/) (previously this required Sencha SDK tools for <= SenchaTouch 2.0).
* Open a terminal (must be cmd on Windows) and run -
`...\senchatouch2>sencha app build --environment package`
* Create a zip archive out of the `build/package` folder and upload it to [PhoneGap Build](https://build.phonegap.com/).

If you clone this project you'll see that the build/package folder is setup as a submodule pointing to another [github repo](https://github.com/chrisprice/PropertyCross-ST2.git). This allows us to make use of the public [PhoneGap Build](https://build.phonegap.com/apps/254779/builds) service to produce native binaries.

For the Windows Phone 8 build, PhoneGap build does not currently support WP8, however the same files in build/package can be dropped into a new PhoneGap project without modification.