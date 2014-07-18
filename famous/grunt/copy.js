// Copies remaining files to places other tasks can use
module.exports = function(grunt, options) {
  var impl = options.package.implName;
  var abbr = options.package.abbr;
  var version = options.package.version;
  var platforms = options.package.platforms;

  var supportWindowsPhone = platforms.indexOf('windowsphone') >= 0;

  return {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          '**/**.{ico,png,txt,jpg,svg,wof,ttf}',
          '.htaccess',
          'images/{,*/}*.webp',
          // '{,*/}*.html',
          'styles/fonts/{,*/}*.*',
          'lib/famous/**/**.css'
        ]
      }]
    },
    configXml: {
      expand: true,
      src: ['config.xml'],
      cwd: supportWindowsPhone ? '../phonegap/common-with-winphone' : '../phonegap/common',
      dest: 'build',
      options: {
        process: function(content) {
          grunt.log.oklns('Setting implementation name to '+impl);
          return content.replace(/\[IMPL\]/g, impl).replace(/\[ID\]/g, abbr).replace(/\[VERSION\]/g, version);
        }
      }
    }
  };
};
