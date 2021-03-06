module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		files:{
			bower: 'bower_components',
            dev: {
                styles: 'dev/styles',
                scripts: 'dev/scripts'
            },
            dist: {
                fonts: 'public/fonts',
                images: 'public/images',
                styles: 'public/styles',
                scripts: 'public/scripts'
            },
            sass:{
				'<%= files.dist.styles %>/main.css': '<%= files.dev.styles %>/src/main.scss'
			}
		},

        copy: {
            fonts: {
                expand: true,
                flatten: true,
                src: '<%= files.bower %>/font-awesome/fonts/*',
                dest: '<%= files.dist.fonts %>/'
            }
        },

		concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    '<%= files.bower %>/foundation/js/vendor/modernizr.js'
                    // ,'<%= files.bower %>/foundation/js/vendor/jquery.js'
                    ,'<%= files.bower %>/foundation/js/vendor/fastclick.js'
                    //,'<%= files.bower %>/foundation/js/vendor/placeholder.js'
                    // ,'<%= files.bower %>/foundation/js/foundation.min.js'
                    ,'<%= files.bower %>/angular/angular.min.js'
                    ,'<%= files.bower %>/angular-foundation/mm-foundation.min.js'
                    ,'<%= files.bower %>/angular-foundation/mm-foundation-tpls.min.js'
                    ,'<%= files.bower %>/angular-facebook/lib/angular-facebook.js'
                ],
                dest: '<%= files.dev.scripts %>/libs.concat.js'
            },
            ng: {
                src: [
                    '<%= files.dev.scripts %>/ng/app.js',
                    '<%= files.dev.scripts %>/ng/svc.js',
                    '<%= files.dev.scripts %>/ng/ctrl.js'
                ],
                dest: '<%= files.dev.scripts %>/ng.concat.js'
            }
        },

		uglify: {
            options: {
                preserveComments: false
                ,mangle: false
                ,sourceMap: true
                ,sourceMapName: '<%= files.dist.scripts %>/app.map'
                // ,drop_console: true
                // ,beautify: true
            },
            app:{
                files: {
                    '<%= files.dist.scripts %>/app.min.js': ['<%= files.dev.scripts %>/libs.concat.js', '<%= files.dev.scripts %>/ng.concat.js']
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
                imagesDir: '<%= files.dist.images %>',
                javascriptsDir: '<%= files.dist.scripts %>',
                importPath: ['<%= files.bower %>/foundation/scss/', '<%= files.bower %>/font-awesome/scss/'],
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
            app:{
                files:['<%= files.dev.scripts %>/ng/*.js'],
                tasks: ['concat:ng', 'uglify:app']
            },
			styles:{
				files:['<%= files.dev.styles %>/src/**/*.scss'],
				tasks: ['compass:dev']
			}
		}
	});

	grunt.registerTask('default', ['dev', 'watch']);
    grunt.registerTask('build-js', ['concat', 'uglify']);
	grunt.registerTask('dev', ['build-js', 'compass:dev', 'copy:fonts']);
	grunt.registerTask('dist', ['build-js', 'compass:dist', 'copy:fonts']);

	grunt.registerTask('lint', ['scsslint', 'jshint']);

    // Tasks for use on Heroku
    grunt.registerTask('heroku:development', ['dev']);
    grunt.registerTask('heroku:production', []);

};
