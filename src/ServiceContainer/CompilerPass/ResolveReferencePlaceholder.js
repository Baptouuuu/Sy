namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of other services by a Reference object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        calls = def.getCalls(),
                        re = /^@.+$/;

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Reference(
                                    calls[i][1][j].substr(1)
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});
