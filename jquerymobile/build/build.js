var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

/*
Example config -
  var config = {
    librarySources:[
      'lib\\jquery-1.8.2.min.js',
      'lib\\jquery.mobile-1.2.0.min.js',
      'lib\\jquery.jsonp-2.1.4.min.js',
      'lib\\knockout-2.2.0rc.debug.js',
      'lib\\cordova-1.9.0.js',
      'lib\\iscroll.js',
      'lib\\jquery.mobile.iscrollview.js'
    ],
    sourceFolders:['model', 'viewModel'],
    sourceFiles:['lib/knockout.js', 'lib/jquery.js', 'app.js'],
    entryModule:'app.js',
    outputFile:'app.min.js'
  };
*/
module.exports = function (config) {
  var compressedSource = 'sources.min.js';
  var sourceFolderFiles = config.sourceFolders.map(function (folder) {
    return fs.readdirSync(folder).map(function (file) {
      return path.join(folder, file);
    });
  });
  var sources = sourceFolderFiles.reduce(function (allFiles, folderFiles) {
    return allFiles.concat(folderFiles);
  }, config.sourceFiles);
  runAMDCompiler(sources, config.entryModule, compressedSource, function (error, stdout, stderr) {
    if (error != null) {
      return console.log('exec error: ' + error, stdout, stderr);
    }
    runAllCompiler(config.librarySources.concat(compressedSource), config.outputFile, function (error, stdout, stderr) {
      if (error != null) {
        return console.log('exec error: ' + error, stdout, stderr);
      }
    });
  });
};

function runCompiler(args, callback) {
  var compiler = path.join(__dirname, 'compiler.jar');
  exec('java -jar ' + compiler + ' ' + args.join(' '), callback);
}

function runAMDCompiler(sourceFiles, entryModule, outputFile, callback) {
  var args = [
    "--compilation_level=SIMPLE_OPTIMIZATIONS",
    "--js_output_file=" + outputFile,
    "--process_common_js_modules" ,
    "--transform_amd_modules" ,
    "--common_js_entry_module=" + entryModule,
    "--output_wrapper='(function(){%output%})();'"
  ];
  runCompiler(args.concat(sourceFiles), callback);
}
function runAllCompiler(sourceFiles, outputFile, callback) {
  var args = [
    "--compilation_level=SIMPLE_OPTIMIZATIONS",
    "--js_output_file=" + outputFile,
    "--warning_level=QUIET"
  ];
  runCompiler(args.concat(sourceFiles), callback);
}

