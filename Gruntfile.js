module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		files:{
			path: {
				bower: 'bower_components',
				images: 'public/images',
				styles: 'public/styles',
				scripts: 'public/scripts'
			},
			sass:{
				'<%= files.path.styles %>/main.css': '<%= files.path.styles %>/src/main.scss'
			}
		},

		concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                	'<%= files.path.bower %>/foundation/modernizr/modernizr.js',
                	'<%= files.path.bower %>/foundation/jquery/dist/jquery.min.js',
                	'<%= files.path.scripts %>/src/social.js',
                	'<%= files.path.scripts %>/src/social.js'
                ],
                dest: '<%= files.path.scripts %>/main.concat.js'
            }
        },

		uglify: {
            options: {},
            dist:{
                files: {
                    '<%= files.path.scripts %>/main.min.js': ['<%= files.path.scripts %>/main.concat.js']
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
                sassDir: '<%= files.path.styles %>/src',
                cssDir: '<%= files.path.styles %>',
                imagesDir: '<%= files.path.images %>',
                javascriptsDir: '<%= files.path.scripts %>',
                importPath: '<%= files.path.bower %>',
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
			  '<%= files.path.styles %>/**/*.scss'
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
				files:['public/scripts/src/*.js'],
				tasks: ['concat', 'uglify']
			},
			styles:{
				files:['<%= files.path.styles %>/src/**/*'],
				tasks: ['compass:dev']
			}
		}
	});

	grunt.registerTask('default', ['dev', 'watch']);
	grunt.registerTask('dev', ['compass:dev']);
	grunt.registerTask('dist', ['compass:dist']);
	grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('heroku:development', ['dev']);
    grunt.registerTask('heroku:production', ['dist']);

};
