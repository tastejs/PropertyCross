module.exports = {
  dist: {
    files: {
      src: [
        '<%= config.dist %>/src/{,*/}*.js',
        '<%= config.dist %>/css/{,*/}*.css',
        // '<%= config.dist %>/images/{,*/}*.*',
        '<%= config.dist %>/css/fonts/{,*/}*.*',
        '<%= config.dist %>/*.{ico,png}'
      ]
    }
  }
};
