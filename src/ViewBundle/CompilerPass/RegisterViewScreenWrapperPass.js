namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as viewscreen wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

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
