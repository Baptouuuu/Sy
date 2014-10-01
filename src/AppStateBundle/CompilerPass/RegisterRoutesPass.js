namespace('Sy.AppStateBundle.CompilerPass');

/**
 * Service container pass to extract routes from config
 *
 * @package Sy
 * @subpackage AppStateBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.AppStateBundle.CompilerPass.RegisterRoutesPass = function () {};
Sy.AppStateBundle.CompilerPass.RegisterRoutesPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var def = container.getDefinition('sy::core::appstate::routeprovider'),
                routes = container.getParameter('routes');

            if (!routes) {
                return;
            }

            for (var name in routes) {
                if (routes.hasOwnProperty(name)) {
                    def.addCall(
                        'setRoute',
                        [
                            name,
                            routes[name].path,
                            routes[name].parameters,
                            routes[name].requirements
                        ]
                    );
                }
            }
        }
    }

});