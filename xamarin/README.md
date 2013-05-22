#Xamarin ProperyCross


Visit the [Xamarin page](http://propertycross.com/xamarin/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[Xamarin](http://xamarin.com/) have two commercial products, _Xamarin.iOS_ for iOS development and _Xamarin.Android_. The Xamarin frameworks allow you to write applications using C# and the .NET framework. For each platform Xamarin provide bindings to the native platform APIs. As a result Xamarin applications make use of the native UI for each mobile platform. Xamarin do not provide a Windows Phone product because the C# and .NET code used for Android and iOS development is directly portable to Windows Phone.

The PropertyCross implementation makes use of the Model View Presenter (MVP) pattern in order to share as much UI logic as possible. The Model and Presenter code is shared across all three mobile platforms, with the View code, which makes use of native UI components, being distinct for each platform. This is reflected in the code-sharing statistics.

##Building the Application


To build the iOS application you will need Xamarin Studio (running on a Mac), for Android you will need Xamarin Studio running on either a Mac or Windows machine, and for the Windows Phone version you will need Visual Studio. Each project has a solution file (.sln) that is loaded in the respective IDE.

The application is structured using the Model View Presenter pattern, which allows for sharing of presentation logic without the need for a binding framework. The shared code is located within the `Common` folder with each version of the application using file linking to include the code within the solution.

## Further reading

 - [Property Finder – a Cross-Platform Xamarin MonoTouch Mobile App](http://www.codeproject.com/Articles/520069/Property-Finder-a-Cross-Platform-Xamarin-MonoTouch) - a more in-depth article about this implementation.
