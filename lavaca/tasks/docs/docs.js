var util = require('util');
module.exports = function(grunt) {
  'use strict';

  var child = require('child_process');

  grunt.registerMultiTask('docs', 'Generates documentation using atnotate', function() {
    var options = this.options();
    var src = this.files[0].src;
    var dest = this.files[0].dest;
    var excludeFiles = this.files[0].exclude || [];
    var done = this.async();
    var atnotatePath = options.atnotate + '/atnotate.py';
    var tmplPath = options.atnotate + '/templates';
    var command = 'python %s -s %s -d %s -t %s' + (excludeFiles.length ? ' -e %s' : '');
    command = util.format(command, atnotatePath, src, dest, tmplPath, excludeFiles.join(','));
    child.exec(command, function(err, stdout) {
      if (err) {
        grunt.log.writeln(stdout);
        grunt.log.error();
        grunt.log.writeln(err);
      }
      done();
    });
  });

};
