module.exports = {
  dev: {
    files: {
      '.tmp/index.html': ['<%= config.app %>/index.html']
    }
  },
  dist: {
    files: {
      '<%= config.dist %>/index.html': ['<%= config.app %>/index.html']
    }
  },
  options: {
    commentMarker: 'process'
  }
};
