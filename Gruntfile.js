module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: { separator: ';'},
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    gitpush: {
      task: {
        options: {
          verbose: true,
          remote: 'live',
          branch: 'master',
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/dist/**/*.js'],
        }
      }
    },

    eslint: {
      target: [
        '**/*.js'
      ]
    },

    cssmin: {
      // Add list of files to lint here
      css: {
        src: 'public/style.css',
        dest: 'public/dist/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: [
          'cssmin'
        ]
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }      
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-npm-install');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'concurrent' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('start', [
    // TODO: figure out how to make npm install --save work
    // TODO: figure out how to make post-receive run grunt commands 
    // (though if we run 'grunt start' in prod once manually, it flows through from there)
    'npm-install', 'build', 'concurrent'
  ]);

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'gitpush' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'upload' ]);
    } else {
      grunt.task.run([ 'eslint', 'build', 'upload' ]);
      // grunt.task.run([ 'eslint', 'mochaTest', 'build', 'upload' ]);
    }
  });

};
