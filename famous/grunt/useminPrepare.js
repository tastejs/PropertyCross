// Reads HTML for usemin blocks to enable smart builds that automatically
// concat, uglify and revision files. Creates configurations in memory so
// additional tasks can operate on them

module.exports = {
  options: {
    dest: '<%= config.dist %>'
  },
  html: '<%= config.dist %>/index.html'
};
