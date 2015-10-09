module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    processhtml: {
      options: {
        // Task-specific options go here.
      },
      dev: {
        files: {
          'background/index_generated.html': ['background/index_template.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-processhtml');
};