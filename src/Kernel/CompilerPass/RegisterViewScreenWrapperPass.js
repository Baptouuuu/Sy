namespace('Sy.Kernel.CompilerPass');

/**
 * Scan for services tagged as viewscreen wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.Kernel.CompilerPass.RegisterViewScreenWrapperPass = function () {
    this.logger = null;
};
Sy.Kernel.CompilerPass.RegisterViewScreenWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     */

    setLogger: {
        value: function (logger) {
            this.logger = logger;
        }
    },

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::view::factory::viewscreen');

            container
                .findTaggedServiceIds('view.viewscreen')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++){
                        if (!el.tags[i][1].alias) {
                            if (this.logger) {
                                this.logger.info(
                                    'Missing alias statement for viewscreen wrapper',
                                    {service: el.id}
                                );
                            }
                            continue;
                        }

                        factory.addCall(
                            'setViewScreenWrapper',
                            [
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});
