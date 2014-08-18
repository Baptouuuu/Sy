namespace('Sy.ServiceContainer');

/**
 * Optimize a container by compiling it with successive passes
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Compiler = function () {
    this.beforeOpti = [];
    this.opti = [
        new Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ApplyParentDefinition(),
    ];
    this.beforeRm = [];
    this.rm = [
        new Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions(),
    ];
    this.afterRm = [];
};

Sy.ServiceContainer.Compiler.prototype = Object.create(Object.prototype, {

    /**
     * Add a new pass to the compiler
     *
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     * @param {String} type Default to before optimization
     */

    addPass: {
        value: function (pass, type) {
            if (!(pass instanceof Sy.ServiceContainer.CompilerPassInterface)) {
                throw new TypeError('Invalid compiler pass');
            }

            switch (type) {
                case pass.BEFORE_OPTIMIZATION:
                    this.beforeOpti.push(pass);
                    break;
                case pass.OPTIMIZE:
                    this.opti.push(pass);
                    break;
                case pass.BEFORE_REMOVING:
                    this.beforeRm.push(pass);
                    break;
                case pass.REMOVE:
                    this.rm.push(pass);
                    break;
                case pass.AFTER_REMOVING:
                    this.afterRm.push(pass);
                    beak;
                default:
                    this.beforeOpti.push(pass);
            }
        }
    },

    /**
     * Compile the service container
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    compile: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.beforeOpti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.opti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.beforeRm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.rm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.afterRm.forEach(function (pass) {
                pass.process(container);
            }, this);
        }
    }

});
