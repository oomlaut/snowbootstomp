module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		files:{
			path: {
				bower: 'bower_components',
				styles: 'public/styles'
			},
			sass:{
				'<%= files.path.styles %>/main.css': '<%= files.path.styles %>/source/main.scss'
			}
		},

		uglify: {
			options: {}
		},

		jshint: {
			options: {
				globals: {}
			}
		},

		compass:{
			options: {
				banner: '/* <%= pkg.name %> styles */',
				loadPath: '<%= files.path.bower %>'
			},
			dev:{
				options:{
					style:'expanded',
					debugInfo: true,
					lineNumber: true
				},
				files: '<%= files.sass %>'
			},
			dist:{
				options:{
					style:'compressed',
					noCache:true,
					quiet:true
				},
				files: '<%= files.sass %>'
			}
		},

		watch: {
			options:{
				debounceDelay:1000,
				livereload:false
			},
			// scripts:{
			// 	files:['public/scripts/source/*.js'],
			// 	tasks: ['uglify']
			// },
			styles:{
				files:['<%= files.path.styles %>/source/*'],
				tasks: ['sass:dev']
			}
		}
	});

	grunt.registerTask('default', ['dev', 'watch']);
	grunt.registerTask('dev', []);
	grunt.registerTask('dist', []);

    grunt.registerTask('heroku:development', ['dev']);
    grunt.registerTask('heroku:production', ['dist']);

};
