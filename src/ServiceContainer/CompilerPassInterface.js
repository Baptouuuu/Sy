namespace('Sy.ServiceContainer');

/**
 * Interface that each compiler pass must implement
 *
 * A pass allow to alter/optimize service definitions
 * at container compilation time
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @interface
 */

Sy.ServiceContainer.CompilerPassInterface = function () {};
Sy.ServiceContainer.CompilerPassInterface.prototype = Object.create(Object.prototype, {

    BEFORE_OPTIMIZATION: {
        value: 'before_optimization',
        writable: false
    },

    OPTIMIZE: {
        value: 'optimize',
        writable: false,
    },

    BEFORE_REMOVING: {
        value: 'before_removing',
        writable: false
    },

    REMOVE: {
        value: 'remove',
        writable: false
    },

    AFTER_REMOVING: {
        value: 'after_removing',
        writable: false
    },

    /**
     * The container is passed to the pass to do its own work
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    process: {
        value: function (container) {}
    }

});
