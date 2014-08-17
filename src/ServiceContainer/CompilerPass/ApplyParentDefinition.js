namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Apply a parent definition to its children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ApplyParentDefinition = function () {};
Sy.ServiceContainer.CompilerPass.ApplyParentDefinition.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        parent,
                        calls;

                    if (def.hasParent()) {
                        parent = this.getDefinition(
                            def.getParent().toString()
                        );

                        if (parent.hasFactory() && !def.hasFactory()) {
                            def.setFactoryService(
                                parent.getFactoryService()
                            );
                            def.setFactoryMethod(
                                parent.getFactoryMethod()
                            );
                        }

                        if (parent.hasConfigurator() && !def.hasConfigurator()) {
                            def.setConfigurator(
                                parent.getConfigurator()
                            );
                            def.setConfiguratorMethod(
                                parent.getConfiguratorMethod()
                            );
                        }

                        calls = parent.getCalls();

                        for (var i = calls.length - 1; i >= 0; i--) {
                            def.addCall(
                                calls[i][0],
                                calls[i][1],
                                true
                            );
                        }
                    }
                }, container);
        }
    }

});
