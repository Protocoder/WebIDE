'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		clean: {
		  build: {
		    src: [ 'build' ]
		  },
		  stylesheets: {
		    src: [ 'build/css/*.css', '!build/css/protocoder.min.css' ]
		  },
		  scripts: {
		    src: [ 'build/js/*.js', '!build/js/protocoder.min.js' ]
		  },
		},

        copy: {
	      build: {
	        cwd: 'source',
	        src: [ '**', '!**/less/**', '!**/oldcss/**' ],
	        dest: 'build',
	        expand: true
	      },
	      toProtocoder: {
	      	cwd: 'build',
	      	src: ['**'],
	      	dest: '../Protocoder/protocoder_app/src/main/assets/webide',
	      	expand: true
	      }
	    },

        jshint : {
        	// define the files to lint
			//files: ['js/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
			    // more options here if you want to override JSHint defaults
			    globals: {
			    	jQuery: true,
			    	console: true,
			    	module: true
			    }
			}
        },

        less: {
        	development: {
		        options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
					//paths: ["build"],
					plugins: [
					//   new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
					//   new (require('less-plugin-clean-css'))(cleanCssOptions)
					],
					modifyVars: {
					//imgPath: '"http://mycdn.com/path/to/images"',
					//bgColor: 'red'
					},
		        },
		        files: {
		        	"build/css/main.css": "source/less/main.less", // destination file and source file
  		        	"build/css/dashboard.css": "source/less/dashboard.less" // destination file and source file
		        }
		    },
        },
        /*
        concat: {
        	css: {
        		//sourceMap: true,
          		src: [
                	'css/main.css',
                	'css/dashboard.css'
                ],
            	dest: 'css/protocoder.concat.css'
       		},
        	js : {
        		//sourceMap: true,
           		src : [
               		'js/*'
        	    ],
            	dest : 'js/protocoder.concat.js'
       		}
    	},
    	*/
        cssmin: {
        	build: {
        		files: {
        			'build/css/protocoder.min.css' : [ 'build/css/*.css' ]
        		}
        	}
           // css: {
           //     src: 'css/protocoder.concat.css',
           //     dest: 'css/protocoder.min.css'
           // }
        },
        uglify: {
            js: {
            	options : {
					//sourceMap : true,
					//sourceMapIncludeSources : true,
					//sourceMapIn : 'js/protocoder.concat.js.map'
				},
                files: {
           	  		//'js/protocoder.min.js': ['<%= concat.js.dest %>']
                    'build/js/protocoder.min.js': ['source/js/*.js']
                }
            }
        },
		watch: {
		  stylesheets: {
		    files: 'source/less/*.less',
		    tasks: [ 'stylesheets' ]
		  },
		  scripts: {
		    files: 'source/js/*.js',
		    tasks: [ 'scripts' ]
		  },
		  copy: {
		    files: [ 'source/**', '!source/less/' ],
		    tasks: [ 'copy' ]
		  }, 
		},
		connect: {
			server: {
		    	options: {
		    		port: 4000,
		    		base: 'build',
		      		hostname: '*'
		    	}
		  	}
		}

    });

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');	
	//grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask(
	  'build', 
	  'Compiles all of the assets and copies the files to the build directory.', 
	  [ 'clean', 'copy:build', 'stylesheets', 'scripts' ]
	);

	grunt.registerTask(
		'stylesheets', 
		'Compiles the stylesheets.', 
		[ 'less', 'cssmin', 'clean:stylesheets' ]
	);
	 
	grunt.registerTask(
		'scripts', 
		'Compiles the JavaScript files.', 
		[ 'jshint', 'uglify', 'clean:scripts' ]
	);

	grunt.registerTask(
		'default', 
		'build and creates a server that check for changes', 
		['build', 'connect', 'watch']
	); 

	grunt.registerTask(
		'deploy', 
		'build and copies to the Protocoder folder', 
		['build', 'copy:toProtocoder']
	); 


};