namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace an alias by the real target definition
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ReplaceAliasByDefinition = function () {};
Sy.ServiceContainer.CompilerPass.ReplaceAliasByDefinition.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id);

                    if (def instanceof Sy.ServiceContainer.Alias) {
                        this.setDefinition(
                            id,
                            this.getDefinition(def.toString())
                        );
                    }
                }, container);
        }
    }

});
