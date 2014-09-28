namespace('Sy.FrameworkBundle.Config');

/**
 * Basic service needed throughout the framework
 *
 * @package Sy
 * @subpackage FrameworkBundle
 * @class
 */

Sy.FrameworkBundle.Config.Service = function () {};
Sy.FrameworkBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::generator::uuid': {
                    constructor: 'Sy.Lib.Generator.UUID'
                },
                'mediator': '@sy::core::mediator',
                'sy::core::mediator': {
                    constructor: 'Sy.Lib.Mediator',
                    calls: [
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                },
                'sy::core::registry::factory': {
                    constructor: 'Sy.RegistryFactory'
                },
                'registry': '@sy::core::registry',
                'sy::core::registry': {
                    constructor: 'Sy.Registry',
                    factory: ['sy::core::registry::factory', 'make'],
                    prototype: true
                },
                'sy::core::stateregistry::factory': {
                    constructor: 'Sy.StateRegistryFactory',
                    calls: [
                        ['setRegistryFactory', ['@sy::core::registry::factory']]
                    ]
                },
                'stateregistry': '@sy::core::stateregistry',
                'sy::core::stateregistry': {
                    constructor: 'Sy.StateRegistry',
                    fatory: ['sy::core::stateregistry::factory', 'make'],
                    prototype: true
                },
                'logger': '@sy::core::logger',
                'sy::core::logger': {
                    constructor: 'Sy.Lib.Logger.CoreLogger',
                    calls: [
                        ['setName', ['core']],
                        ['setHandler', ['@sy::core::logger::handler::info', '%logger.level.info%']],
                        ['setHandler', ['@sy::core::logger::handler::debug', '%logger.level.debug%']],
                        ['setHandler', ['@sy::core::logger::handler::error', '%logger.level.error%']],
                        ['setHandler', ['@sy::core::logger::handler::log', '%logger.level.log%']],
                    ]
                },
                'sy::core::logger::handler::info': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.info%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::debug': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.debug%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::error': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.error%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::log': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.log%']]
                    ],
                    private: true
                },
                'sy::core::propertyaccessor': {
                    constructor: 'Sy.PropertyAccessor',
                    prototype: true
                }
            });
        }
    }
});