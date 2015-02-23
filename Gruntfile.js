var path = require('path');
module.exports = function(grunt) {

  var config = {
    copy: {
      src: {
        files: [{
          expand: true,
          src: [
            'index.html',
            'vendor/**/*.*',
            'package.json',
            'pifm-browser.js',
            'lib/**',
            'favicon.ico',
            'README.md'
          ],
          dest: 'dist/'
        }]
      }
    },
  useminPrepare: {
      html: 'index.html',
      options: {
                    flow: {
                      html: {
                          steps: {
                            js: ['concat', 'uglifyjs'],
                              css: [
                                  {
                                      name: 'uncss',
                                      createConfig: function (context, block) {
                                          context.outFiles = [block.dest];
                                          return {
                                              files: [{
                                                  dest: path.join(context.outDir, block.dest),
                                                  src: ['index.html']
                                              }]
                                          };
                                      }
                                  },
                                  {
                                    name: 'autoprefixer',
                                    createConfig: function (context, block) {
                                        context.outFiles = [block.dest];
                                        return {
                                          options: {
                                              browsers: ['last 2 versions', 'ie 8', 'ie 9']
                                            },
                                            files: [{
                                                src: path.join(context.inDir, block.dest),
                                                dest: path.join(context.outDir, block.dest)
                                            }]
                                        };
                                    }
                                },
                                'cssmin'
                              ]
                          },
                          post: {}
                      }
                  }
              }
          },
  usemin: {
    html: 'dist/*.html'
  },
  htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'dist/index.html',
            'dist/false.html': 'dist/false.html'
          }
      }
  }
};

  grunt.initConfig(config);

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['copy', 'useminPrepare', 'concat', 'uglify', 'uncss', 'autoprefixer', 'cssmin', 'usemin', 'htmlmin']);
};
