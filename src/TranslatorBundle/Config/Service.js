namespace('Sy.TranslatorBundle.Config');

/**
 * Register translator config
 *
 * @package Sy
 * @subpackage TranslatorBundle
 * @class
 */

Sy.TranslatorBundle.Config.Service = function () {};
Sy.TranslatorBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                translator: '@sy::core::translator',
                'sy::core::translator': {
                    constructor: 'Sy.Translator',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']],
                        ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
                    ]
                }
            });
        }
    }
});