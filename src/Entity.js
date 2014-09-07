namespace('Sy');

/**
 * Default implementation of an entity
 *
 * @package Sy
 * @class
 * @implements {Sy.EntityInterface}
 */

Sy.Entity = function () {};
Sy.Entity.prototype = Object.create(Sy.EntityInterface.prototype, {

    INDEXES: {
        value: [],
        enumerable: false
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (attr, value) {
            if (attr instanceof Object) {
                for (var p in attr) {
                    if (attr.hasOwnProperty(p)) {
                        this.set(p, attr[p]);
                    }
                }
            } else {
                this[attr] = value;
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {
            return this[attr];
        }
    }

});