
'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('blueprint', 'Generator for user-defined templates', function(templatePathRaw,destinationPathRaw) {
      var paths = grunt.config.get('paths');
      var defaultSrc = __dirname+"/templates";
      var options = this.options({
          dest :paths.src.www + 'js/app',
          src: defaultSrc,
          extension: '.js'
      });
      var framework = this.target;
      var destinationParts = destinationPathRaw.split('/');
      var translatedParts = templatePathRaw.split('/');
      if( options.map ){
          translatedParts = translatedParts.map(function(part){
              return (options.map[part])
                ? options.map[part]
                : part;
          });
          translatedParts = translatedParts.join('/').split('/');
      }
      var type = translatedParts.pop();
      var wildcardIndex = destinationParts.indexOf('*');
      if( wildcardIndex>-1)
          destinationParts[wildcardIndex]=translatedParts.join('/');
      destinationParts.unshift(options.dest);
      var fileName = destinationParts[destinationParts.length-1];
      options.className = grunt.util._.classify(fileName + type);
      options.package = [grunt.util._.camelize(options.appName)].concat(translatedParts).join('.');
      options.type = type;
      options.fqn = grunt.util._.join('.',options.package, options.className);
      options.baseName = fileName + options.extension;
      options.objectName = fileName.toLowerCase();
      var destinationPath = destinationParts.join('/') + type + options.extension;
      var sourcePath = grunt.util._.join('/', options.src, framework, templatePathRaw) + options.extension;
      if( ! grunt.file.exists(sourcePath))
          sourcePath = grunt.util._.join('/', defaultSrc, framework, templatePathRaw) + options.extension;
      var templateFile = grunt.file.read(sourcePath);
      grunt.verbose.writeln('Options:', options);
      grunt.verbose.writeln("Read:", sourcePath);
      var fileContent = grunt.template.process(templateFile,{data:options});
      grunt.file.write(destinationPath, fileContent);
      grunt.log.writeln('Generated:', destinationPath);
  });

};
