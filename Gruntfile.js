module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '\n* <%= pkg.name %> - v<%= pkg.version %> \n* © Copyright <%= grunt.template.today("yyyy") %>  Liangli Huang\n',
        connect: {
            server: {
                options: {
                    port: 10000,
                    livereload: true,
                    keepalive: true
                }
            }
        },

        // Grunt Tasks
        less: {
            dist: {
                options: {},
                files: {
                    // target.css file: source.less file
                    "dist/css/site.css": "src/assets/less/site.less"
                }
            }
        },
        copy: {
            angular: {
                src: ['angular.js', 'angular.min.js', 'angular-route.js'],
                cwd: 'bower_components/angular',
                expand: true,
                dest: 'dist/assets/'
            },
            angular_route: {
                src: 'angular-route.js',
                cwd: 'bower_components/angular-route',
                expand: true,
                dest: 'dist/assets/'
            },
            vendor_metisMenu: {
                src: 'metisMenu/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            vendor_morrisjs: {
                src: 'morrisjs/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            vendor_fontawesome: {
                src: 'font-awesome/**/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            vendor_raphael: {
                src: 'raphael/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            vendor_data: {
                src: 'data/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor'
            },
            vendor_sbadmin: {
                src: 'sb-admin/**/*',
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            vendor_datatables: {
                src: ['datatables/**/*','datatables-plugins/*','datatables-responsive/*'],
                cwd: 'vendor',
                expand: true,
                dest: 'dist/assets/vendor/'
            },
            jquery: {
                src: ['jquery.js', 'jquery.min.js'],
                cwd: 'bower_components/jquery/dist',
                expand: true,
                dest: 'dist/assets/'
            },
            jqueryUI: {
                src: ['jquery-ui.min.js'],
                cwd: 'bower_components/jquery-ui',
                expand: true,
                dest: 'dist/assets/'
            },
            bootstrap: {
                src: '**/*',
                cwd: 'bower_components/bootstrap/dist',
                expand: true,
                dest: 'dist/assets/bootstrap'
            },
            assets: {
                src: ['img/*', 'js/*'],
                expand: true,
                cwd: 'src/assets',
                dest: 'dist/'
            },
            templates: {
                src: '**/*.html',
                cwd: 'src/app',
                expand: true,
                dest: 'dist/app/views'
            },
            index: {
                src: '*.html',
                cwd: 'src',
                expand: true,
                dest: 'dist/'
            }
        },
        concat: {
            dist: {
                src: [
                  "src/app/**/*.js", "!src/**/*spec.js"
                ],
                dest: 'dist/js/app.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    preserveComments: 'some'
                },
                files: {
                    'dist/js/app.min.js': 'dist/js/app.js',
                    'dist/js/script.min.js': 'dist/js/script.js'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            appjs: {
                files: ['src/app/**/*.js'], // which files to watch
                tasks: ['concat', 'uglify', 'usebanner:js']
            },
            apptemplates: {
                files: ['src/app/**/*.html', 'src/*.html'], // which files to watch
                tasks: ['copy:templates', 'copy:index']
            },
            assets: {
                files: ['src/assets/**/*', '!src/assets/**/*.less'], // everything bar less
                tasks: ['copy:assets', 'cssmin', 'usebanner']
            },
            assetsless: {
                files: ['src/assets/**/*.less'],
                tasks: ['less', 'cssmin', 'usebanner:css']
            }
        },
        jshint: {
            all: ['src/app/**/*.js']
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }]
            }
        },
        usebanner: {
            js: {
                options: {
                    position: 'top',
                    banner: '/*! <%= banner %> */',
                    linebreak: true
                },
                files: {
                    src: ['dist/js/*.js']
                }
            },
            css: {
                options: {
                    position: 'top',
                    banner: '/* <%= banner %> */',
                    linebreak: true
                },
                files: {
                    src: ['dist/css/*.css']
                }
            }
        },
        clean: ['dist'],
        "string-replace": {
            dist: {
                files: {
                    'src/': 'src/app/common/common.js'
                },
                options: {
                    replacements: [
                      {
                          pattern: /clientVersion: ".*?",/,
                          replacement: 'clientVersion: "bb1",'
                      },
                      {
                          pattern: /clientRevision: ".*?",/,
                          replacement: 'clientRevision: "bb2",'
                      },
                      {
                          pattern: /clientBuild: ".*?",/,
                          replacement: 'clientBuild: "bb3",'
                      },
                      {
                          pattern: /clientTimestamp: ".*?",/,
                          replacement: 'clientTimestamp: "bb4",'
                      }
                    ]
                }
            }
        }


    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task.
    grunt.registerTask('default', ['clean', 'less', 'copy', 'concat', 'uglify', 'cssmin', 'usebanner']);

    grunt.registerTask('updateVersion', function (version, revision, build, timestamp) {
        grunt.option("clientVersion", "asdfasf");
        grunt.task.run("string-replace");
    });

};