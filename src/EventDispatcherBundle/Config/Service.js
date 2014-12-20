namespace('Sy.EventDispatcherBundle.Config');

/**
 * Register the compiler pass to register listeners
 *
 * @package Sy
 * @subpackage EventDispatcherBundle
 * @class
 */

Sy.EventDispatcherBundle.Config.Service = function () {};
Sy.EventDispatcherBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            var pass = new Sy.EventDispatcherBundle.CompilerPass.RegisterListenersPass();

            container.set({
                'sy::core::event_dispatcher': {
                    constructor: 'Sy.EventDispatcherBundle.ContainerAwareEventDispatcher',
                    calls: [
                        ['setServiceContainer', ['@container']]
                    ]
                }
            });

            container.addPass(
                pass,
                pass.AFTER_REMOVING
            );
        }
    }
});
