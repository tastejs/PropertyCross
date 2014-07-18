module.exports =  {
  compile: {
    options: {
      optimize: 'uglify2',
      uglify2: {
        mangler: {
          toplevel: true
        }
      },
      baseUrl: '<%= config.app %>/src',
      mainConfigFile: '<%= config.app %>/src/requireConfig.js',
      name: 'almond',
      include: 'main',
      insertRequire: ['main'],
      out: '<%= config.dist %>/src/main.js',
      wrap: true
    }
  }
};
