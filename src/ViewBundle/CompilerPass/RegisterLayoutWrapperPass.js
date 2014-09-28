namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as layout wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::view::factory::layout');

            container
                .findTaggedServiceIds('view.layout')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        if (!el.tags[i][1].viewscreen) {
                            continue;
                        }

                        factory.addCall(
                            'setLayoutWrapper',
                            [
                                el.tags[i][1].viewscreen,
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});
