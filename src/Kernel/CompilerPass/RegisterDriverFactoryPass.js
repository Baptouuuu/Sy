namespace('Sy.Kernel.CompilerPass');

/**
 * Pass to look for driver factories and register them in the appropriate factory
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.Kernel.CompilerPass.RegisterDriverFactoryPass = function () {};
Sy.Kernel.CompilerPass.RegisterDriverFactoryPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::storage::dbal::factory');

            container
                .findTaggedServiceIds('storage.driver_factory')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        factory.addCall(
                            'setDriverFactory',
                            [
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                }, this);
        }
    }

});
