#Xamarin-MvvmCross PropertyCross


Visit the [Xamarin-MvvmCross page](http://propertycross.com/xamarin-mvvmcross/) on the PropertyCross website for screenshots and code sharing metrics.

##Introduction

[Xamarin](http://xamarin.com/) have two commercial products, _Xamarin.iOS_ for iOS development and _Xamarin.Android_. The Xamarin frameworks allow you to write applications using C# and the .NET framework. For each platform Xamarin provide bindings to the native platform APIs. As a result Xamarin applications make use of the native UI for each mobile platform. Xamarin do not provide a Windows Phone product because the C# and .NET code used for Android and iOS development is directly portable to Windows Phone.

Xamarin applications share common business logic, written in C# and most often shared via Portable Class Libraries, however, the UI logic is specific to each platform. [MvvmCross](https://github.com/MvvmCross/MvvmCross) is a popular framework that adds data binding support to both Android and iOS for Xamarin applications. With this framework you can share view models as well as business logic, significantly increasing the amount of code that is shared across the target platforms.

##Building the Application

To build the application you will need to download and install [Xamarin Studio](http://xamarin.com/studio). The dependencies are managed by NuGet which can be added as an extension to Xamarin Studio using the instructions from the following site:

 + https://github.com/mrward/monodevelop-nuget-addin