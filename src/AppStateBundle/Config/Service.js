namespace('Sy.AppStateBundle.Config');

/**
 * Register appstate services
 *
 * @package Sy
 * @subpackage AppStateBundle
 * @class
 */

Sy.AppStateBundle.Config.Service = function () {};
Sy.AppStateBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::appstate::routeprovider': {
                    constructor: 'Sy.AppState.RouteProvider',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']]
                    ]
                },
                'sy::core::appstate::router': {
                    constructor: 'Sy.AppState.Router',
                    calls: [
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']]
                    ]
                },
                'sy::core::appstate::urlmatcher': {
                    constructor: 'Sy.AppState.UrlMatcher',
                    calls: [
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']]
                    ]
                },
                'sy::core::appstate': {
                    constructor: 'Sy.AppState.Core',
                    calls: [
                        ['setUrlMatcher', ['@sy::core::appstate::urlmatcher']],
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setMediator', ['@sy::core::mediator']],
                        ['setStateHandler', ['@sy::core::appstate::statehandler']]
                    ]
                },
                'sy::core::appstate::statehandler': {
                    constructor: 'Sy.AppState.StateHandler'
                }
            });

            container.addPass(
                new Sy.AppStateBundle.CompilerPass.RegisterRoutesPass()
            );
        }
    }
});