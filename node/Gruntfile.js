module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        express: {
            options: {
                script: './app.js',
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
                files: ['app.js', '**/*.js', '!**/node_modules/**'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            prod: {
                files: ['app.js', '**/*.js', '!**/node_modules/**'],
                tasks: ['express:prod'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // https://github.com/ericclemmons/grunt-express-server
    grunt.loadNpmTasks('grunt-express-server');
    // https://github.com/gruntjs/grunt-contrib-watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dist', ['express:prod'])
    grunt.registerTask('default', ['express:dev', 'watch:dev']);
    //grunt.registerTask('test', ['nodemon:dev']);
}
