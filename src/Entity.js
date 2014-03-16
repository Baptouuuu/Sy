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

    indexes: {
        value: [],
        enumerable: false
    },

    connections: {
        value: {},
        enumerable: false
    },

    UUID: {
        value: 'uuid'
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

            if (this.connections[attr] && typeof value === 'string') {
                this.attributes[attr] = new this.connections[attr]();
                this.attributes[attr].set(this.attributes[attr].UUID, value);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {

            return this.attributes[attr];

        }
    },

    /**
     * @inheritDoc
     */

    register: {
        value: function (attr, entity) {

            var regexp = new RegExp(/^\w+::\w+$/gi);

            if (this.indexes.indexOf(attr) === -1) {
                this.indexes.push(attr);

                if (entity !== undefined) {

                    if (!regexp.test(entity)) {
                        throw new SyntaxError('Invalid entity name format');
                    }

                    var path = entity.split('::');

                    this.connections[attr] = App.Bundle[path[0]].Entity[path[1]];

                }
            }

            return this;

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
    },

    /**
     * @inheritDoc
     */

    getRaw: {
        value: function () {

            var pojo = {};

            for (var attr in this.attributes) {
                if (this.attributes.hasOwnProperty(attr)) {

                    if (this.locked && this.lockedAttributes.indexOf(attr) === -1) {
                        continue;
                    }

                    pojo[attr] = this.attributes[attr];

                    if (this.connections[attr]) {
                        pojo[attr] = pojo[attr].get(pojo[attr].UUID);
                    }

                    if (pojo[attr] instanceof Date) {
                        pojo[attr] = pojo[attr].toJSON();
                    }

                }
            }

            return pojo;

        }
    }

});