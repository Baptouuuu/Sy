namespace('Sy.Kernel.CompilerPass');

/**
 * Scan for services tagged as list wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.Kernel.CompilerPass.RegisterListWrapperPass = function () {
    this.logger = null;
};
Sy.Kernel.CompilerPass.RegisterListWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

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
            var factory = container.getDefinition('sy::core::view::factory::list');

            container
                .findTaggedServiceIds('view.list')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            if (this.logger) {
                                this.logger.info(
                                    'Missing alias statement for list wrapper',
                                    {service: el.id}
                                );
                            }
                            continue;
                        }

                        if (!el.tags[i][1].viewscreen) {
                            if (this.logger) {
                                this.logger.info(
                                    'Missing viewscreen statement for list wrapper',
                                    {service: el.id}
                                );
                            }
                            continue;
                        }

                        if (!el.tags[i][1].layout) {
                            if (this.logger) {
                                this.logger.info(
                                    'Missing layout statement for list wrapper',
                                    {service: el.id}
                                );
                            }
                            continue;
                        }

                        factory.addCall(
                            'setListWrapper',
                            [
                                el.tags[i][1].viewscreen,
                                el.tags[i][1].layout,
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});
