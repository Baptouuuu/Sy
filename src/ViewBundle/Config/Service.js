namespace('Sy.ViewBundle.Config');

/**
 * Register view engine services
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 */

Sy.ViewBundle.Config.Service = function () {};
Sy.ViewBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            var vs = new Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass(),
                layout = new Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass(),
                list = new Sy.ViewBundle.CompilerPass.RegisterListWrapperPass()
                subscriber = new Sy.ViewBundle.CompilerPass.RegisterSubscriberPass();

            container.set({
                'sy::core::view::parser': {
                    constructor: 'Sy.View.Parser'
                },
                'sy::core::view::factory::list': {
                    constructor: 'Sy.View.ListFactory',
                    calls: [
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistry', ['@sy::core::registry']]
                    ]
                },
                'sy::core::view::factory::layout': {
                    constructor: 'Sy.View.LayoutFactory',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']],
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistryFactory', ['@sy::core::registry::factory']],
                        ['setListFactory', ['@sy::core::view::factory::list']]
                    ]
                },
                'sy::core::view::factory::viewscreen': {
                    constructor: 'Sy.View.ViewScreenFactory',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']],
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistryFactory', ['@sy::core::registry::factory']],
                        ['setLayoutFactory', ['@sy::core::view::factory::layout']],
                    ]
                },
                'sy::core::view::template::engine': {
                    constructor: 'Sy.View.TemplateEngine',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']],
                        ['setGenerator', ['@sy::core::generator::uuid']]
                    ]
                },
                'sy::core::viewport': {
                    constructor: 'Sy.View.ViewPort',
                    calls: [
                        ['setNode', [document.querySelector('.viewport')]],
                        ['setViewManager', ['@sy::core::view::manager']],
                        ['setMediator', ['@sy::core::mediator']]
                    ]
                },
                'sy::core::view::manager': {
                    constructor: 'Sy.View.Manager',
                    configurator: ['sy::core::view::managerconfigurator', 'configure'],
                    calls: [
                        ['setViewsRegistry', ['@sy::core::registry']],
                        ['setViewScreenFactory', ['@sy::core::view::factory::viewscreen']]
                    ],
                },
                'sy::core::view::managerconfigurator': {
                    constructor: 'Sy.View.ManagerConfigurator',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']]
                    ]
                },
                'sy::core::view::subscriber::appstate': {
                    constructor: 'Sy.ViewBundle.Subscriber.AppStateSubscriber',
                    calls: [
                        ['setViewPort', ['@sy::core::viewport']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                }
            });

            container
                .addPass(vs)
                .addPass(layout)
                .addPass(list)
                .addPass(subscriber);
        }
    }
});