module.exports = function (grunt) {

    var generator = [
            'src/Lib/Generator/Interface.js',
            'src/Lib/Generator/UUID.js'
        ],
        logger = [
            'src/Lib/Logger/Interface.js',
            'src/Lib/Logger/Handler/Interface.js',
            'src/Lib/Logger/Handler/Console.js',
            'src/Lib/Logger/CoreLogger.js'
        ],
        mediator = [
            'src/Lib/Mediator.js'
        ],
        http = [
            'src/Lib/Logger/Interface.js',
            'src/HTTP/RequestInterface.js',
            'src/HTTP/ResponseInterface.js',
            'src/HTTP/Request.js',
            'src/HTTP/Response.js',
            'src/HTTP/JSONRequest.js',
            'src/HTTP/JSONResponse.js',
            'src/HTTP/HeaderParser.js',
            'src/HTTP/HTMLRequest.js',
            'src/HTTP/HTMLResponse.js',
            'src/HTTP/ImageRequest.js',
            'src/HTTP/ImageResponse.js',
            'src/HTTP/Manager.js',
            'src/HTTP/REST.js'
        ],
        storage = [
            'src/EntityInterface.js',
            'src/Entity.js',
            'src/Storage/Core.js',
            'src/Storage/IdentityMap.js',
            'src/Storage/LifeCycleEvent.js',
            'src/Storage/Manager.js',
            'src/Storage/ManagerFactory.js',
            'src/Storage/Repository.js',
            'src/Storage/RepositoryFactory.js',
            'src/Storage/RepositoryFactoryConfigurator.js',
            'src/Storage/UnitOfWork.js',
            'src/Storage/UnitOfWorkFactory.js',
            'src/Storage/Dbal/DriverFactoryInterface.js',
            'src/Storage/Dbal/DriverInterface.js',
            'src/Storage/Dbal/Factory.js',
            'src/Storage/Dbal/IndexedDB.js',
            'src/Storage/Dbal/IndexedDBFactory.js',
            'src/Storage/Dbal/Localstorage.js',
            'src/Storage/Dbal/LocalstorageFactory.js',
            'src/Storage/Dbal/Rest.js',
            'src/Storage/Dbal/RestFactory.js',
        ],
        validator = [
            'src/Validator/ConstraintInterface.js',
            'src/Validator/ConstraintValidatorInterface.js',
            'src/Validator/Core.js',
            'src/Validator/AbstractConstraint.js',
            'src/Validator/AbstractConstraintValidator.js',
            'src/Validator/Constraint/Blank.js',
            'src/Validator/Constraint/BlankValidator.js',
            'src/Validator/Constraint/Callback.js',
            'src/Validator/Constraint/CallbackValidator.js',
            'src/Validator/Constraint/Choice.js',
            'src/Validator/Constraint/ChoiceValidator.js',
            'src/Validator/Constraint/Country.js',
            'src/Validator/Constraint/CountryValidator.js',
            'src/Validator/Constraint/Date.js',
            'src/Validator/Constraint/DateValidator.js',
            'src/Validator/Constraint/Email.js',
            'src/Validator/Constraint/EmailValidator.js',
            'src/Validator/Constraint/EqualTo.js',
            'src/Validator/Constraint/EqualToValidator.js',
            'src/Validator/Constraint/False.js',
            'src/Validator/Constraint/FalseValidator.js',
            'src/Validator/Constraint/GreaterThan.js',
            'src/Validator/Constraint/GreaterThanValidator.js',
            'src/Validator/Constraint/GreaterThanOrEqual.js',
            'src/Validator/Constraint/GreaterThanOrEqualValidator.js',
            'src/Validator/Constraint/Ip.js',
            'src/Validator/Constraint/IpValidator.js',
            'src/Validator/Constraint/Length.js',
            'src/Validator/Constraint/LengthValidator.js',
            'src/Validator/Constraint/LessThan.js',
            'src/Validator/Constraint/LessThanValidator.js',
            'src/Validator/Constraint/LessThanOrEqual.js',
            'src/Validator/Constraint/LessThanOrEqualValidator.js',
            'src/Validator/Constraint/NotBlank.js',
            'src/Validator/Constraint/NotBlankValidator.js',
            'src/Validator/Constraint/NotEqualTo.js',
            'src/Validator/Constraint/NotEqualToValidator.js',
            'src/Validator/Constraint/NotNull.js',
            'src/Validator/Constraint/NotNullValidator.js',
            'src/Validator/Constraint/NotUndefined.js',
            'src/Validator/Constraint/NotUndefinedValidator.js',
            'src/Validator/Constraint/Null.js',
            'src/Validator/Constraint/NullValidator.js',
            'src/Validator/Constraint/Range.js',
            'src/Validator/Constraint/RangeValidator.js',
            'src/Validator/Constraint/Regex.js',
            'src/Validator/Constraint/RegexValidator.js',
            'src/Validator/Constraint/True.js',
            'src/Validator/Constraint/TrueValidator.js',
            'src/Validator/Constraint/Type.js',
            'src/Validator/Constraint/TypeValidator.js',
            'src/Validator/Constraint/Undefined.js',
            'src/Validator/Constraint/UndefinedValidator.js',
            'src/Validator/Constraint/Url.js',
            'src/Validator/Constraint/UrlValidator.js',
            'src/Validator/ConstraintFactory.js',
            'src/Validator/ConstraintValidatorFactory.js',
            'src/Validator/ConstraintViolation.js',
            'src/Validator/ConstraintViolationList.js',
            'src/Validator/ExecutionContext.js',
            'src/Validator/ExecutionContextFactory.js'
        ],
        form = [
            'src/Form/FormInterface.js',
            'src/Form/FormBuilderInterface.js',
            'src/Form/FormTypeInterface.js',
            'src/Form/Form.js',
            'src/Form/FormBuilder.js',
            'src/Form/Builder.js',
        ],
        view = [
            'src/View/LayoutFactoryInterface.js',
            'src/View/ListFactoryInterface.js',
            'src/View/TemplateEngineInterface.js',
            'src/View/ViewScreenFactoryInterface.js',
            'src/View/Event/ViewPortEvent.js',
            'src/View/NodeWrapper.js',
            'src/View/Layout.js',
            'src/View/LayoutFactory.js',
            'src/View/List.js',
            'src/View/ListFactory.js',
            'src/View/Manager.js',
            'src/View/ManagerConfigurator.js',
            'src/View/Parser.js',
            'src/View/TemplateEngine.js',
            'src/View/ViewPort.js',
            'src/View/ViewScreen.js',
            'src/View/ViewScreenFactory.js',
        ],
        configurator = [
            'src/ConfiguratorInterface.js',
            'src/Configurator.js'
        ],
        registry = [
            'src/RegistryInterface.js',
            'src/Registry.js',
            'src/RegistryFactory.js'
        ],
        stateRegistry = [
            'src/StateRegistryInterface.js',
            'src/StateRegistry.js',
            'src/StateRegistryFactory.js',
        ],
        serviceContainer = [
            'src/ServiceContainer/Core.js',
            'src/ServiceContainer/Alias.js',
            'src/ServiceContainer/Compiler.js',
            'src/ServiceContainer/CompilerPassInterface.js',
            'src/ServiceContainer/Definition.js',
            'src/ServiceContainer/Parameter.js',
            'src/ServiceContainer/Reference.js',
            'src/ServiceContainer/CompilerPass/ApplyParentDefinition.js',
            'src/ServiceContainer/CompilerPass/RemoveAbstractDefinitions.js',
            'src/ServiceContainer/CompilerPass/ResolveParameterPlaceholder.js',
            'src/ServiceContainer/CompilerPass/ResolveReferencePlaceholder.js',
        ],
        translator = [
            'src/Translator.js',
        ],
        factory = [
            'src/FactoryInterface.js',
        ],
        dom = [
            'src/DOM.js'
        ],
        propertyAccessor = [  //need the reflection.js vendor
            'src/PropertyAccessor.js'
        ],
        appState = [
            'src/AppState/Route.js',
            'src/AppState/Router.js',
            'src/AppState/RouteProvider.js',
            'src/AppState/Core.js',
            'src/AppState/UrlMatcher.js',
            'src/AppState/State.js',
            'src/AppState/StateHandler.js',
            'src/AppState/AppStateEvent.js',
            'src/AppState/RouteNotFoundEvent.js',
            'src/AppState/UrlMatcher.js',
        ],
        eventDispatcher = [
            'src/EventDispatcher/Event.js',
            'src/EventDispatcher/EventDispatcherInterface.js',
            'src/EventDispatcher/EventDispatcher.js',
            'src/EventDispatcher/ImmutableEventDispatcher.js',
            'src/EventDispatcher/EventSubscriberInterface.js',
            'src/EventDispatcher/GenericEvent.js',
        ],
        framework = [
            'src/functions.js',
            'src/ControllerInterface.js',
            'src/Kernel/ActionDispatcher.js',
            'src/Kernel/AppParser.js',
            'src/Kernel/ControllerManager.js',
            'src/Kernel/Core.js',
            'src/Kernel/FeatureTester.js',
            'src/Event/AppShutdownEvent.js',
            'src/Event/ControllerEvent.js',
            'src/Controller.js',
            'src/FrameworkBundle/Config/Configuration.js',
            'src/FrameworkBundle/Config/Service.js',
            'src/FormBundle/Config/Service.js',
            'src/HttpBundle/Config/Service.js',
            'src/StorageBundle/Config/Service.js',
            'src/TranslatorBundle/Config/Service.js',
            'src/ValidatorBundle/Config/Service.js',
            'src/ViewBundle/Config/Service.js',
            'src/ViewBundle/Subscriber/AppStateSubscriber.js',
            'src/AppStateBundle/Config/Service.js',
            'src/ContainerAwareEventDispatcher.js'
        ],
        frameworkPasses = [
            'src/FrameworkBundle/CompilerPass/EventSubscriberPass.js',
            'src/FormBundle/CompilerPass/FormTypePass.js',
            'src/StorageBundle/CompilerPass/RegisterDriverFactoryPass.js',
            'src/ViewBundle/CompilerPass/RegisterLayoutWrapperPass.js',
            'src/ViewBundle/CompilerPass/RegisterListWrapperPass.js',
            'src/ViewBundle/CompilerPass/RegisterViewScreenWrapperPass.js',
            'src/ViewBundle/CompilerPass/RegisterSubscriberPass.js',
            'src/AppStateBundle/CompilerPass/RegisterRoutesPass.js',
            'src/EventDispatcherBundle/CompilerPass/RegisterListenersPass.js',
        ],
        unique = function (el, idx, array) {
            if (array.indexOf(el) !== idx && array.indexOf(el) < idx) {
                return false;
            }

            return true;
        };

    generator.unshift('src/functions.js');
    logger.unshift('src/functions.js');
    configurator.unshift('src/functions.js');
    eventDispatcher.unshift('src/functions.js');
    serviceContainer = serviceContainer.concat(propertyAccessor);
    registry = factory.concat(registry);
    mediator = mediator
        .concat(generator)
        .concat(logger);
    stateRegistry = factory
        .concat(registry)
        .concat(stateRegistry);
    http = http
        .concat(generator)
        .concat(registry);
    storage = factory  //need the observe-js vendor
        .concat(logger)
        .concat(http)
        .concat(mediator)
        .concat(registry)
        .concat(stateRegistry)
        .concat(generator)
        .concat(storage)
        .concat(propertyAccessor);
    validator = factory
        .concat(registry)
        .concat(validator);
    form = form
        .concat(configurator)
        .concat(validator);
    view = factory
        .concat(registry)
        .concat(generator)
        .concat(mediator)
        .concat(dom)
        .concat(view);
    translator = translator
        .concat(registry)
        .concat(stateRegistry);

    serviceContainer.unshift('src/functions.js');
    mediator.unshift('src/functions.js');
    registry.unshift('src/functions.js');
    stateRegistry.unshift('src/functions.js');
    http.unshift('src/functions.js');
    storage.unshift('src/functions.js');
    validator.unshift('src/functions.js');
    view.unshift('src/functions.js');
    translator.unshift('src/functions.js');
    appState.unshift('src/functions.js');

    framework = framework
        .concat(generator)
        .concat(logger)
        .concat(factory)
        .concat(mediator)
        .concat(http)
        .concat(propertyAccessor)
        .concat(storage)
        .concat(validator)
        .concat(form)
        .concat(view)
        .concat(configurator)
        .concat(registry)
        .concat(stateRegistry)
        .concat(serviceContainer)
        .concat(frameworkPasses)
        .concat(translator)
        .concat(dom)
        .concat(appState)
        .concat(eventDispatcher);

    serviceContainer = serviceContainer.filter(unique);
    registry = registry.filter(unique);
    stateRegistry = stateRegistry.filter(unique);
    http = http.filter(unique);
    storage = storage.filter(unique);
    validator = validator.filter(unique);
    view = view.filter(unique);
    translator = translator.filter(unique);
    framework = framework.filter(unique);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>#<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'dist/framework.min.js': framework,
                    'dist/generator.min.js': generator,
                    'dist/logger.min.js': logger,
                    'dist/mediator.min.js': mediator,
                    'dist/http.min.js': http,
                    'dist/storage.min.js': storage,
                    'dist/validator.min.js': validator,
                    'dist/view.min.js': view,
                    'dist/configurator.min.js': configurator,
                    'dist/registry.min.js': registry,
                    'dist/state-registry.min.js': stateRegistry,
                    'dist/service-container.min.js': serviceContainer,
                    'dist/translator.min.js': translator,
                    'dist/property-accessor.min.js': propertyAccessor,
                    'dist/appstate.min.js': appState,
                    'dist/event-dispatcher.min.js': eventDispatcher
                }
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %>#<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            framework: {
                src: framework,
                dest: 'dist/framework.js'
            },
            generator: {
                src: generator,
                dest: 'dist/generator.js'
            },
            logger: {
                src: logger,
                dest: 'dist/logger.js'
            },
            mediator: {
                src: mediator,
                dest: 'dist/mediator.js'
            },
            http: {
                src: http,
                dest: 'dist/http.js'
            },
            storage: {
                src: storage,
                dest: 'dist/storage.js'
            },
            validator: {
                src: validator,
                dest: 'dist/validator.js'
            },
            view: {
                src: view,
                dest: 'dist/view.js'
            },
            configurator: {
                src: configurator,
                dest: 'dist/configurator.js'
            },
            registry: {
                src: registry,
                dest: 'dist/registry.js'
            },
            stateRegistry: {
                src: stateRegistry,
                dest: 'dist/state-registry.js'
            },
            serviceContainer: {
                src: serviceContainer,
                dest: 'dist/service-container.js'
            },
            translator: {
                src: translator,
                dest: 'dist/translator.js'
            },
            propertyAccessor: {
                src: propertyAccessor,
                dest: 'dist/property-accessor.js'
            },
            appState: {
                src: appState,
                dest: 'dist/appstate.js'
            },
            eventDispatcher: {
                src: eventDispatcher,
                dest: 'dist/event-dispatcher.js'
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
                        case 'validator':
                            path = 'validator/';
                            break;
                        case 'form':
                            path = 'form/';
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

                    return './node_modules/venus/bin/venus run -t tests/' + path + ' -c -n';
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
        },
        compare_size: {
            files: [
                'dist/framework.js',
                'dist/framework.min.js'
            ]
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['bower-install']);
    grunt.registerTask('build', ['jscs', 'uglify', 'concat', 'compare_size']);
    grunt.registerTask('test', [
        'jscs',
        'exec:test:lib',
        'exec:test:storage',
        'exec:test:view',
        'exec:test:kernel',
        'exec:test:event',
        'exec:test:validator',
        'exec:test:form',
        'exec:test:topLevel'
    ]);

};
