module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>#<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: {
                    'vendor/sy/framework.min.js': [
                        'vendor/sy/src/functions.js',
                        'vendor/sy/src/Lib/Generator/Interface.js',
                        'vendor/sy/src/Lib/Generator/UUID.js',
                        'vendor/sy/src/Lib/Logger/Handler/Interface.js',
                        'vendor/sy/src/Lib/Logger/Handler/Console.js',
                        'vendor/sy/src/Lib/Logger/Interface.js',
                        'vendor/sy/src/Lib/Logger/CoreLogger.js',
                        'vendor/sy/src/Lib/Mediator.js',
                        'vendor/sy/src/ConfiguratorInterface.js',
                        'vendor/sy/src/Configurator.js',
                        'vendor/sy/src/ControllerInterface.js',
                        'vendor/sy/src/Controller.js',
                        'vendor/sy/src/EntityInterface.js',
                        'vendor/sy/src/ServiceContainerInterface.js',
                        'vendor/sy/src/ServiceContainer.js',
                        'vendor/sy/src/ServiceInterface.js',
                        'vendor/sy/src/StackInterface.js',
                        'vendor/sy/bootstrap.js'
                    ]
                }
            }
        },
        'bower-install': {
            target: {
                html: 'index.html',
                jsPattern: '<script src="{{filePath}}"></script>'
            }
        },
        shell: {
            syTests: {
                command: 'venus run -t vendor/sy/tests -n',
                options: {
                    stdout: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['bower-install']);
    grunt.registerTask('test', ['shell:syTests']);

};
