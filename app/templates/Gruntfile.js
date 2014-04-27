module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Compass
    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: 'tmp/css',
          imagesDir: 'assets/img',
          javascriptsDir: 'assets/js',
          fontsDir: 'assets/fonts',
          outputStyle: 'nested',
          relativeAssets: true,
          noLineComments: true,
          importPath: [
            'bower_components/bourbon/app/assets/stylesheets',
            'bower_components/foundation/scss'
          ]
        }
      }
    },

    // CSS minification + Add banner for WordPress
    cssmin: {
      add_banner: {
        options: {
          banner: '/*\n'+
                      'Theme Name: <%= _.slugify(themename) %>\n'+
                      'Theme URI: <%= _.slugify(themeuri) %>\n'+
                      'Description: <%= _.slugify(themedescription) %>\n'+
                      'Author: <%= _.slugify(author) %>\n'+
                      'Author URI: <%= _.slugify(authoruri) %>\n'+
                      'Version: <%= _.slugify(themeversion) %>\n'+
                      'License: GNU General Public License v2.0\n'+
                      'License URI: http://www.gnu.org/licenses/gpl-2.0.html\n'+
                  '*/\n'
        },
        files: {
          'style.css': ['tmp/css/app.css']
        }
      }
    },

    // Check to make sure we didn't miss any prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      dist: {
        src: 'style.css',
        dest: 'style.css'
      }
    },

    // Create an IE specific stylesheet since IE8 doesn't know what 'rem' is
    pixrem: {
      options: {
        rootvalue: '18px',
        replace: true
      },
      dist: {
        src: 'style.css',
        dest: 'assets/css/rem-fallback.css'
      }
    },

    // Copy files we need from bower
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['bower_components/modernizr/modernizr.js'], dest: 'tmp/js/', filter: 'isFile'}
        ]
      }
    },

    // Combine Foundation JS files into one + Older browser JS
    concat: {
      ie: {
        options: {
          separator: "\n\n"
        },
        src: [
          "bower_components/selectivizr/selectivizr.js",
          "bower_components/respond/dest/respond.min.js"
        ],
        dest: "tmp/js/ie.js"
      },
      dist: {
        options: {
          separator: "\n\n"
        },
        src: [
          // Foundation Vendor
          "bower_components/foundation/js/vendor/fastclick.js",
          "bower_components/foundation/js/vendor/placeholder.js",

          // Foundation Core
          "bower_components/foundation/js/foundation/foundation.js",
          "bower_components/foundation/js/foundation/foundation.abide.js",
          "bower_components/foundation/js/foundation/foundation.accordion.js",
          "bower_components/foundation/js/foundation/foundation.alert.js",
          "bower_components/foundation/js/foundation/foundation.clearing.js",
          "bower_components/foundation/js/foundation/foundation.dropdown.js",
          "bower_components/foundation/js/foundation/foundation.equalizer.js",
          "bower_components/foundation/js/foundation/foundation.interchange.js",
          "bower_components/foundation/js/foundation/foundation.joyride.js",
          "bower_components/foundation/js/foundation/foundation.magellan.js",
          "bower_components/foundation/js/foundation/foundation.offcanvas.js",
          "bower_components/foundation/js/foundation/foundation.orbit.js",
          "bower_components/foundation/js/foundation/foundation.reveal.js",
          "bower_components/foundation/js/foundation/foundation.tab.js",
          "bower_components/foundation/js/foundation/foundation.tooltip.js",
          "bower_components/foundation/js/foundation/foundation.topbar.js",

          // Theme scripts
          "src/js/_skip-link-focus-fix.js",
          "src/js/_theme.js"
          ],
        dest: "tmp/js/scripts.js"
      }
    },

    // Minify all scripts
    uglify: {
      min: {
        files: {
          "assets/js/scripts.min.js": ["tmp/js/scripts.js"],
          "assets/js/ie.min.js": ["tmp/js/ie.js"],
          "assets/js/vendor/modernizr.js": ["tmp/js/modernizr.js"]
        }
      }
    },

    // Optimize images
    imagemin: {
      img: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'assets/img/',
          src: '**/*.{png,jpg,gif}',
          dest: 'assets/img/'
        }]
      },
      ico: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'assets/ico/',
          src: '**/*.{png,jpg,gif}',
          dest: 'assets/ico/'
        }]
      }
    },

    // Watch for file changes
    watch: {
      options: {
        livereload: true
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['stylesheets', 'scripts']
      },
      markup: {
        files: ["*.php"],
      },
      compass: {
        files: ['scss/**/*'],
        tasks: ['stylesheets']
      }
    }
  });

  // register task
  grunt.registerTask('stylesheets', [
    'compass',
    'autoprefixer',
    'cssmin',
    'pixrem'
  ]);

  // register task
  grunt.registerTask('scripts', [
    'copy',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'stylesheets',
    'scripts',
    'watch'
  ]);
};