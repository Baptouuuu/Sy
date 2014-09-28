namespace('Sy.FormBundle.Config');

/**
 * Register form service
 *
 * @package Sy
 * @package FormBundle
 * @class
 */

Sy.FormBundle.Config.Service = function () {};
Sy.FormBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::form': {
                    constructor: 'Sy.Form.Builder',
                    calls: [
                        ['setValidator', ['@sy::core::validator']]
                    ]
                }
            });
        }
    }
});