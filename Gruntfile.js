module.exports = function(grunt) {


    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    //监听文件变化
	    watch: {
	    	less: {
	    		files: ['src/less/*.less'],
	    		tasks: ['less','uglify']
	    	},
	    	scripts: {
			    files: ['src/js/*.js'],
			    tasks: ['jshint','uglify'],
			    options: {
			    	spawn: false,
				}
	  		},
	        // 	html: {
			//     files: ['index.html'],
			//     tasks: ['connect']
			// },
			livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },
 
                files: [  //更改下面文件就会实时刷新网页
                    '*.html',
                    'src/css/*.css',
                    'src/js/*.js'
                ]
            }
	    },
	    jshint:{
	    	all: ['src/js/*.js']
	    },
	    less: {
	    	development: {
			    options: {
			    	// paths: ['less/']
			    },
			    files: {
			    	'src/css/master.css': 'src/less/master.less' //结果文件：原始文件
			    }
			},
	    },
	    //压缩文件
	    uglify: {
			options: {
				banner: '/*! 注释信息 */',
				manage: false
			},
			my_target: {
				files: {
					'src/css/master.min.css': 'src/css/master.css',
					'src/js/handlers.min.js': 'src/js/handlers.js'
				}
			}
	    },
	    connect: {
            options: {
                port: 9000,
                hostname: 'localhost', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35729  //声明给 watch 监听的端口
            },
 
            server: {
                options: {
                    open: true, //自动打开网页 http://
                    base: '',  //主目录
                }
            }
        }

});

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('uglif', ['uglify:my_target:']);
  grunt.registerTask('default', [
        'connect:server',
        'watch'
    ]);

};