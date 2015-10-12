module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    processhtml: {
      options: {
        // Task-specific options go here.
      },
      background: {
        files: {
          'background/index_generated.html': ['background/index_template.html']
        }
      }
    },

    watch: {
      background: {
        files: ['background/index_template.html', 'background/styles.scss'],
        tasks: ['sass:background', 'processhtml:background'],
        options: {
          spawn: false,
        },
      },
    },

    watch: {
      background: {
        files: ['config/development.js', 'config/production.js'],
        tasks: ['copy:dev'],
        options: {
          spawn: false,
        },
      },
    },

    copy: {
      dev: {
        files: [
          {
            expand: true,
            src: 'config/development.js',
            rename: function() {
              return 'config/config_generated.js';
            }
          },
        ],
      },
      production: {
        files: [
          {
            expand: true,
            src: 'config/production.js',
            rename: function() {
              return 'config/config_generated.js';
            }
          },
        ],
      }
    },

    sass: {
      background: {
        options: {
          style: 'expanded',
          cacheLocation: 'tmp/.sass-cache',
          sourcemap: 'none'
        },
        files: {
          'tmp/background_styles.css': 'background/styles.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
};