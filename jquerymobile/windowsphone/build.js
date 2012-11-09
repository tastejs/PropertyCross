var build = require('../build/build');

build({
  basePath: __dirname,
  librarySources:[
    'lib/cordova-1.9.0.js',
    'lib/jquery-1.8.2.min.js',
    'lib/jquery.jsonp-2.1.4.min.js',
    'lib/jquery.mobile-1.2.0.min.js',
    'lib/knockout-2.2.0rc.debug.js',
    'lib/plugins/app-bar/js/app-bar.js',
    'lib/plugins/app-bar/js/jquery.easing.1.3.js',
    'lib/plugins/progress-bar/js/progress-bar.js'
  ],
  sourceFolders:['model', 'viewModel'],
  sourceFiles:['lib/knockout.js', 'lib/jquery.js', 'app.js'],
  entryModule:'app.js',
  outputFile:'app.min.js'
});
