namespace('Sy.Kernel.CompilerPass');

/**
 * Pass that register registered form types
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.Kernel.CompilerPass.FormTypePass = function () {};
Sy.Kernel.CompilerPass.FormTypePass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var formBuilder = container.getDefinition('sy::core::form');

            container
                .findTaggedServiceIds('form.type')
                .forEach(function (el) {
                    formBuilder.addCall(
                        'registerFormType',
                        ['@' + el.id]
                    );
                }, this);
        }
    }

});
