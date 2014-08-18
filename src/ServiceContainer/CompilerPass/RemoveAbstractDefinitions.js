namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Remove abstract definitions as their're been copied to their children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions = function () {};
Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id);

                    if (def.isAbstract()) {
                        this.remove(id);
                    }
                }, container);
        }
    }

});
