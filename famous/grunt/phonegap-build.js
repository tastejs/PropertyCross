// ...
module.exports = function(grunt, options) {

  var downloads = {
    ios: "<%= package.name %>-ios.ipa",
    android: "<%= package.name %>-android.apk"
  };

  if (options.package.platforms.indexOf('windowsphone') >= 0) {
    downloads.winphone = "<%= package.name %>-winphone.xap";
  }

  return {
    debug: {
      options: {
        archive: "app.zip",
        appId: "<%= package.appId %>",
        user: {
          email: "<%= grunt.option('pgb.email') || 'propertycrossbuilds+' + package.abbr + '@gmail.com' %>",
          password: "<%= grunt.option('pgb.password') %>"
        },
        download: downloads
      }
    }
  };
};
