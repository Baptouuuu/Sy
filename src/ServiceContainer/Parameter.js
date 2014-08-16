namespace('Sy.ServiceContainer');

/**
 * Reference of a parameter from the configurator
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Parameter = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Parameter.prototype = Object.create(Object.prototype, {

    /**
     * Return the parameter id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

})
