module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    express: {
      options: { 
        script: './bin/www',
       },
      dev: {
        options: {
          node_env: 'development',
          port: 3000,
          background: true
        }
      },
      prod: {
        options: {
          node_env: 'production',
          port: 80,
          background: true
        }
      }
    },

    watch: {
      dev: {
        files:  [ 'app.js', 'controllers/*.js', 'models/*.js' ],
        tasks:  [ 'express:dev'],
        options: { spawn: false }
      },
      prod: {
        files:  [ '*.js', '**/*.js' ],
        tasks:  [ 'express:prod' ],
        options: { spawn: false }
      }
    }
  });

  // https://github.com/ericclemmons/grunt-express-server
  grunt.loadNpmTasks('grunt-express-server');
  // https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('server', [ 'express:prod', 'watch:prod' ])
  grunt.registerTask('default', ['express:dev', 'watch:dev']);
}
