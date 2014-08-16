namespace('Sy.ServiceContainer');

/**
 * Reference to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Reference = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Reference.prototype = Object.create(Object.prototype, {

    /**
     * Return the referenced service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

});
