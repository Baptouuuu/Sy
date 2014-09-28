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
                    constructor: 'Sy.AppState.RouteProvider'
                }
            });

            container.addPass(
                new Sy.AppStateBundle.CompilerPass.RegisterRoutesPass()
            );
        }
    }
});