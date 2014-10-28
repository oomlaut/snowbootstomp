module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		files:{
			bower: 'bower_components',
			images: 'public/images',
            dev: {
                styles: 'dev/styles',
                scripts: 'dev/scripts'
            },
            dist: {
                styles: 'public/styles',
                scripts: 'public/scripts'
            },
            sass:{
				'<%= files.dist.styles %>/main.css': '<%= files.dev.styles %>/src/main.scss'
			}
		},

		concat: {
            options: {
                separator: ';'
            },
            ng: {
                src: [
                    '<%= files.dev.scripts %>/ng/app.js',
                    '<%= files.dev.scripts %>/ng/svc.js',
                    '<%= files.dev.scripts %>/ng/ctrl.js'
                ],
                dest: '<%= files.dist.scripts %>/ng.js'
            },
            main: {
                src: [
                	'<%= files.bower %>/foundation/js/vendor/modernizr.js',
                	'<%= files.bower %>/foundation/js/vendor/jquery.js',
                	'<%= files.bower %>/foundation/js/vendor/fastclick.js',
                	'<%= files.bower %>/foundation/js/vendor/placeholder.js',
                	'<%= files.bower %>/foundation/js/foundation.min.js',
                	'<%= files.dev.scripts %>/src/social.js'
                ],
                dest: '<%= files.dev.scripts %>/main.concat.js'
            }
        },

		uglify: {
            options: {},
            dist:{
                files: {
                    '<%= files.dist.scripts %>/main.min.js': ['<%= files.dev.scripts %>/main.concat.js']
                }
            }
        },

		jshint: {
			options: {
				globals: {}
			}
		},

		compass: {
            options: {
                sassDir: '<%= files.dev.styles %>/src',
                cssDir: '<%= files.dist.styles %>',
                imagesDir: '<%= files.images %>',
                javascriptsDir: '<%= files.dist.scripts %>',
                importPath: '<%= files.bower %>',
                force: true
            },
            dev: {
                options: {
                    environment: 'development',
                    outputStyle: 'nested',
                    debugInfo: true
                }
            },
            dist: {
                options: {
                    environment: 'production',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            clean: {
            	options: {
            		clean: true
            	}
            }
        },

		scsslint: {
			allFiles: [
			  '<%= files.dev.styles %>/**/*.scss'
			],
			options: {
			  reporterOutput: 'scss-lint-report.xml',
			  colorizeOutput: true
			}
		},

		watch: {
			options:{
				debounceDelay:1000,
				livereload:false
			},
			scripts:{
				files:['<%= files.dev.scripts %>/src/**/*.js'],
				tasks: ['build-js']
			},
			styles:{
				files:['<%= files.dev.styles %>/src/**/*.scss'],
				tasks: ['compass:dev']
			}
		}
	});

	grunt.registerTask('default', ['dev', 'watch']);
	grunt.registerTask('build-js', ['concat', 'uglify']);
	grunt.registerTask('dev', ['build-js', 'compass:dev']);
	grunt.registerTask('dist', ['build-js', 'compass:dist']);

	grunt.registerTask('lint', ['scsslint', 'jshint']);

    // Tasks for use on Heroku
    grunt.registerTask('heroku:development', ['dev']);
    grunt.registerTask('heroku:production', []);

};
