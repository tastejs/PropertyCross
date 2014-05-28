// Performs rewrite based on rev and the useminPrepare configuration
module.exports = {
  options: {
    assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
  },
  html: ['<%= config.dist %>/{,*/}*.html'],
  css: ['<%= config.dist %>/css/{,*/}*.css']
};
