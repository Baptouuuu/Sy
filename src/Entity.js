namespace('Sy');

/**
 * Default implementation of an entity
 *
 * @package Sy
 * @class
 * @implements {Sy.EntityInterface}
 */

Sy.Entity = function () {
    this.attributes = {};
    this.register(this.UUID);
};
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
                this.attributes[attr] = value;
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {

            if (attr === undefined) {
                return this.attributes;
            } else {
                return this.attributes[attr];
            }

        }
    },

    /**
     * @inheritDoc
     */

    lock: {
        value: function (attributes) {

            if (!(attributes instanceof Array)) {
                throw new SyntaxError();
            }

            if (Object.isSealed(this.attributes)) {
                return;
            }

            for (var i = 0, l = attributes.length; i < l; i++) {
                this.attributes[attributes[i]] = null;
            }

            Object.seal(this.attributes);

            return this;

        }
    }

});