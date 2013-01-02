Xamarin PropertyCross
=====================

This is an implementation of the PropertyCross application using Xamarin's MonoTouch and Mono for Android frameworks. These are commercially available frameworks sold by Xamarin.

http://www.xamarin.com

Xamarin's frameworks allow you to develop Android and iOS applications using C# and the .NET framework. The application UI is entirely native with the iOS applications using a C# API which is 'bound' to the native Objective-C API, and the Android applications using a C# binding to the native Java APIs.

Because Windows Phone uses C# as its development language, no Xamarin tools are required to build the Windows Phone version.

Building the Application
========================

To build the iOS application you will need Xamarin MonoTouch (running on a Mac), for Android you will need Mono for Android and for the Windows Phone version you will need Visual Studio. Each project has a solution file (.sln) that is loaded in the respective IDE.

The application is structured using the Model View Presenter pattern, which allows for sharing of presentation logic without the need for a binding framework. The shared code is located within the `Common` folder with each version of the application using file linking to include the code within the solution.
