module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>#<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                files: {
                    'framework.min.js': [
                        'src/functions.js',
                        'src/Lib/Generator/Interface.js',
                        'src/Lib/Generator/UUID.js',
                        'src/Lib/Logger/Handler/Interface.js',
                        'src/Lib/Logger/Handler/Console.js',
                        'src/Lib/Logger/Interface.js',
                        'src/Lib/Logger/CoreLogger.js',
                        'src/Lib/Mediator.js',
                        'src/HTTP/RequestInterface.js',
                        'src/HTTP/Request.js',
                        'src/HTTP/HTMLRequest.js',
                        'src/HTTP/JSONRequest.js',
                        'src/HTTP/ResponseInterface.js',
                        'src/HTTP/Response.js',
                        'src/HTTP/HTMLResponse.js',
                        'src/HTTP/JSONResponse.js',
                        'src/HTTP/HeaderParser.js',
                        'src/HTTP/Manager.js',
                        'src/HTTP/REST.js',
                        'src/Storage/Core.js',
                        'src/Storage/EngineInterface.js',
                        'src/Storage/EngineFactory.js',
                        'src/Storage/Engine/IndexedDB.js',
                        'src/Storage/Engine/Localstorage.js',
                        'src/Storage/Engine/Rest.js',
                        'src/Storage/Manager.js',
                        'src/Storage/ManagerFactory.js',
                        'src/Storage/RepositoryInterface.js',
                        'src/Storage/Repository.js',
                        'src/Storage/RepositoryFactory.js',
                        'src/ConfiguratorInterface.js',
                        'src/Configurator.js',
                        'src/ControllerInterface.js',
                        'src/Controller.js',
                        'src/EntityInterface.js',
                        'src/Entity.js',
                        'src/FactoryInterface.js',
                        'src/QueueInterface.js',
                        'src/Queue.js',
                        'src/RegistryInterface.js',
                        'src/Registry.js',
                        'src/ServiceContainerInterface.js',
                        'src/ServiceContainer.js',
                        'src/ServiceInterface.js',
                        'bootstrap.js'
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
                command: function (pkg) {
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
                        case 'topLevel':
                            path = [
                                'entity.js',
                                'functions.js',
                                'queue.js',
                                'registry.js',
                                'registryfactory.js',
                                'queuefactory.js',
                                'servicecontainer.js',
                                'translator.js',
                            ].join(',tests/');
                            break;
                    }

                    return 'venus run -t tests/' + path + ' -n --singleton';
                },
                options: {
                    stdout: true
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
    grunt.registerTask('test', [
        'jscs',
        'shell:syTests:lib',
        'shell:syTests:storage',
        'shell:syTests:view',
        'shell:syTests:topLevel'
    ]);

};
