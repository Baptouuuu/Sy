namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as list wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterListWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterListWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

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
                            continue;
                        }

                        if (!el.tags[i][1].viewscreen) {
                            continue;
                        }

                        if (!el.tags[i][1].layout) {
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
