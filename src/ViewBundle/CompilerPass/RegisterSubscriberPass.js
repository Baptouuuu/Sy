namespace('Sy.ViewBundle.CompilerPass');

/**
 * Add the app state subscriber tag if the app state will initialize
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterSubscriberPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterSubscriberPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var def = container.getDefinition('sy::core::view::subscriber::appstate');

            if (container.hasParameter('routes')) {
                def.addTag('event.subscriber', {name: 'event.subscriber'});
            }
        }
    }

});
