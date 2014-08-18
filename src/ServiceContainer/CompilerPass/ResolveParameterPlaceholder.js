namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of container parameters by a Parameter object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

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
                        re = /^%[a-zA-Z-_.]+%$/;

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Parameter(
                                    calls[i][1][j].substring(
                                        1,
                                        calls[i][1][j].length - 1
                                    )
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});
