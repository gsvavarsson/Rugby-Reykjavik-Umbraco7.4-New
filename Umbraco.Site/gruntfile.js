module.exports = function (grunt) {

    //1. All configuration goes in here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            //2. Configuration for concatenating files goes in here
            dist: {
                options: {
                    seperator: '\n\n'
                },
                src: [
                    'scripts/libs/*.js',
                    'scripts/src/*.js'
                ],
                dest: 'scripts/app/compiled.js'
            }
        },
        /**
          * Sass
        */
        sass: {
           
            dist: {
                options: {
                    style: 'compressed',
                    compass: true
                },
                files: {
                    'css/rustikus/rustikus.css' : 'sass/rustikus/rustikus.scss'
                }
            }
        },
        uglify: {
            build: {
                src: ['scripts/app/compiled.js'],
                dest: 'scripts/app/app.min.js'
            }
        },
        watch: {
            js: {
                files: [
                    'sass/rustikus/**/*.scss',
                    'scripts/src/*.js',
                    'scripts/libs/*.js'
                ],
                tasks: ['sass', 'concat', 'uglify']
            }
        }
    });

    //3. Where we tell Grunt we plan on using this plugin
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //4. Where we tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', ['concat', 'sass', 'uglify', 'watch']);
}