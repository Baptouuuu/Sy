namespace('Sy.FormBundle.CompilerPass');

/**
 * Pass that register registered form types
 *
 * @package Sy
 * @subpackage FormBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.FormBundle.CompilerPass.FormTypePass = function () {};
Sy.FormBundle.CompilerPass.FormTypePass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

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
