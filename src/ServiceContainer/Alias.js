namespace('Sy.ServiceContainer');

/**
 * Alias to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Alias = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Alias.prototype = Object.create(Object.prototype, {

    /**
     * Return the original service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id
        }
    }

});
