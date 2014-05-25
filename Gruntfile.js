module.exports = function (grunt) {

    var frameworkFiles = [
        'src/functions.js',
        /* interfaces first */
        'src/ConfiguratorInterface.js',
        'src/ControllerInterface.js',
        'src/EntityInterface.js',
        'src/FactoryInterface.js',
        'src/HTTP/RequestInterface.js',
        'src/HTTP/ResponseInterface.js',
        'src/Lib/Generator/Interface.js',
        'src/Lib/Logger/Handler/Interface.js',
        'src/Lib/Logger/Interface.js',
        'src/StateRegistryInterface.js',
        'src/RegistryInterface.js',
        'src/ServiceContainerInterface.js',
        'src/Storage/RepositoryInterface.js',
        'src/Storage/EngineInterface.js',
        'src/Storage/StoreMapperInterface.js',
        'src/View/LayoutFactoryInterface.js',
        'src/View/ListFactoryInterface.js',
        'src/View/TemplateEngineInterface.js',
        'src/View/ViewScreenFactoryInterface.js',
        /* kernel */
        'src/Kernel/ActionDispatcher.js',
        'src/Kernel/AppParser.js',
        'src/Kernel/ControllerManager.js',
        'src/Kernel/Core.js',
        'src/Kernel/FeatureTester.js',
        /* libs */
        'src/Lib/Generator/UUID.js',
        'src/Lib/Logger/CoreLogger.js',
        'src/Lib/Logger/Handler/Console.js',
        'src/Lib/Mediator.js',
        /* http */
        'src/HTTP/Request.js',
        'src/HTTP/Response.js',
        'src/HTTP/JSONRequest.js',
        'src/HTTP/JSONResponse.js',
        'src/HTTP/HeaderParser.js',
        'src/HTTP/HTMLRequest.js',
        'src/HTTP/HTMLResponse.js',
        'src/HTTP/Manager.js',
        'src/HTTP/REST.js',
        /* storage */
        'src/Storage/Core.js',
        'src/Storage/Engine/IndexedDB.js',
        'src/Storage/Engine/Localstorage.js',
        'src/Storage/Engine/Rest.js',
        'src/Storage/EngineFactory/AbstractFactory.js',
        'src/Storage/EngineFactory/Core.js',
        'src/Storage/EngineFactory/IndexedDBFactory.js',
        'src/Storage/EngineFactory/LocalstorageFactory.js',
        'src/Storage/EngineFactory/RestFactory.js',
        'src/Storage/Manager.js',
        'src/Storage/ManagerFactory.js',
        'src/Storage/Repository.js',
        'src/Storage/RepositoryFactory.js',
        'src/Storage/StoreMapper/IndexedDBMapper.js',
        'src/Storage/StoreMapper/LocalstorageMapper.js',
        'src/Storage/StoreMapper/RestMapper.js',
        'src/Storage/UnitOfWork.js',
        'src/Storage/UnitOfWorkFactory.js',
        /* view */
        'src/View/NodeWrapper.js',
        'src/View/Layout.js',
        'src/View/LayoutFactory.js',
        'src/View/List.js',
        'src/View/ListFactory.js',
        'src/View/Manager.js',
        'src/View/Parser.js',
        'src/View/TemplateEngine.js',
        'src/View/ViewPort.js',
        'src/View/ViewScreen.js',
        'src/View/ViewScreenFactory.js',
        /* top objects */
        'src/Configurator.js',
        'src/Controller.js',
        'src/DOM.js',
        'src/Entity.js',
        'src/ParamProxy.js',
        'src/StateRegistry.js',
        'src/StateRegistryFactory.js',
        'src/Registry.js',
        'src/RegistryFactory.js',
        'src/ServiceContainer.js',
        'src/Translator.js',
        'bootstrap.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>#<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: {
                    'dist/framework.min.js': frameworkFiles
                }
            },
            concat: {
                files: {
                    'dist/framework.js': frameworkFiles
                },
                options: {
                    mangle: false,
                    beautify: true
                }
            }
        },
        'bower-install': {
            target: {
                html: 'index.html',
                jsPattern: '<script src="{{filePath}}"></script>'
            }
        },
        exec: {
            test: {
                cmd: function (pkg) {
                    var path;

                    switch (pkg) {
                        case 'lib':
                            path = 'lib/';
                            break;
                        case 'storage':
                            path = 'storage/';
                            break;
                        case 'view':
                            path = 'view/';
                            break;
                        case 'kernel':
                            path = 'kernel';
                            break;
                        case 'event':
                            path = 'event';
                            break;
                        case 'topLevel':
                            path = [
                                'entity.js',
                                'functions.js',
                                'stateregistry.js',
                                'stateregistryfactory.js',
                                'registry.js',
                                'registryfactory.js',
                                'servicecontainer.js',
                                'translator.js',
                            ].join(',tests/');
                            break;
                    }

                    return './node_modules/venus/bin/venus run -t tests/' + path + ' -c -n --singleton';
                }
            }
        },
        watch: {
            js: {
                files: ['src/*.js'],
                tasks: [],
                options: {
                    livereload: true
                }
            }
        },
        jscs: {
            src: 'src/**/*.js',
            options: {
                requireCurlyBraces: [
                    'if',
                    'else',
                    'for',
                    'do',
                    'while',
                    'try',
                    'catch',
                ],
                requireSpaceAfterKeywords: [
                    'if',
                    'else',
                    'for',
                    'do',
                    'while',
                    'switch',
                    'try',
                    'catch'
                ],
                requireParenthesesAroundIIFE: true,
                requireSpacesInFunctionExpression: {
                    beforeOpeningRoundBrace: true,
                    beforeOpeningCurlyBrace: true
                },
                disallowSpacesInsideObjectBrackets: true,
                disallowSpacesInsideArrayBrackets: true,
                disallowSpacesInsideParentheses: true,
                disallowQuotedKeysInObjects: true,
                disallowSpaceAfterObjectKeys: true,
                requireCommaBeforeLineBreak: true,
                requireOperatorBeforeLineBreak: [
                    '?',
                    '+',
                    '-',
                    '/',
                    '*',
                    '=',
                    '==',
                    '===',
                    '!=',
                    '!==',
                    '>',
                    '>=',
                    '<',
                    '<='
                ],
                disallowLeftStickedOperators: [
                    '?',
                    '+',
                    '-',
                    '/',
                    '*',
                    '=',
                    '==',
                    '===',
                    '!=',
                    '!==',
                    '>',
                    '>=',
                    '<',
                    '<='
                ],
                requireRightStickedOperators: ['!'],
                disallowRightStickedOperators: [
                    '?',
                    '+',
                    '/',
                    '*',
                    ':',
                    '=',
                    '==',
                    '===',
                    '!=',
                    '!==',
                    '>',
                    '>=',
                    '<',
                    '<='
                ],
                requireLeftStickedOperators: [','],
                disallowSpaceAfterPrefixUnaryOperators: [
                    '++',
                    '--',
                    '+',
                    '-',
                    '~',
                    '!'
                ],
                disallowSpaceBeforePostfixUnaryOperators: [
                    '++',
                    '--'
                ],
                requireSpaceBeforeBinaryOperators: [
                    '+',
                    '-',
                    '/',
                    '*',
                    '=',
                    '==',
                    '===',
                    '!=',
                    '!=='
                ],
                requireSpaceAfterBinaryOperators: [
                    '+',
                    '-',
                    '/',
                    '*',
                    '=',
                    '==',
                    '===',
                    '!=',
                    '!=='
                ],
                requireCamelCaseOrUpperCaseIdentifiers: true,
                disallowKeywords: ["with"],
                disallowMultipleLineBreaks: true,
                validateQuoteMarks: '\'',
                disallowMixedSpacesAndTabs: true,
                disallowTrailingWhitespace: true,
                disallowKeywordsOnNewLine: ['else'],
                requireDotNotation: true,
                validateJSDoc: {
                    checkParamNames: true,
                    checkRedundantParams: true,
                    requireParamTypes: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['bower-install']);
    grunt.registerTask('build', ['jscs', 'uglify']);
    grunt.registerTask('test', [
        'jscs',
        'exec:test:lib',
        'exec:test:storage',
        'exec:test:view',
        'exec:test:topLevel'
    ]);

};
