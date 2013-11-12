namespace('Sy');

/**
 * Default implementation of an entity
 *
 * @package Sy
 * @class
 * @implements {Sy.EntityInterface}
 */

Sy.EntityInterface = function (attributes) {

    this.attributes = attributes;

};

Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    indexes: {
        value: [],
        enumerable: false
    },

    connections: {
        value: {},
        enumerable: false
    },

    locked: {
        value: false,
        enumerable: false
    },

    lockedAttributes: {
        value: [],
        enumerable: false
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (attr, value) {

            if (this.locked && this.lockedAttributes.indexOf(attr) !== -1) {
                this.attributes[attr] = value;
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

            return this.attributes[attr];

        }
    },

    /**
     * @inheritDoc
     */

    register: {
        value: function (attr, entity) {

            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi);

            if (this.indexes.indexOf(attr) === -1) {
                this.indexes.push(attr);

                if (entity !== undefined) {

                    if(!regexp.test(entity)) {
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

            this.locked = true;

            this.lockedAttributes = attributes;

            return this;

        }
    }

});