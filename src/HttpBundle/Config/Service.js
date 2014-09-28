namespace('Sy.HttpBundle.Config');

/**
 * Register the http services
 *
 * @package Sy
 * @subpackage HttpBundle
 * @class
 */

Sy.HttpBundle.Config.Service = function () {};
Sy.HttpBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                rest: '@sy::core::http::rest',
                'sy::core::http::rest': {
                    constructor: 'Sy.HTTP.REST',
                    calls: [
                        ['setManager', ['@sy::core::http']]
                    ]
                },
                http: '@sy::core::http',
                'sy::core::http': {
                    constructor: 'Sy.HTTP.Manager',
                    calls: [
                        ['setParser', ['@sy::core::http::parser']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setRegistry', ['@sy::core::registry']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                },
                'sy::core::http::parser': {
                    constructor: 'Sy.HTTP.HeaderParser',
                    private: true
                }
            });
        }
    }
});