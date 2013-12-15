namespace('Sy.Storage.Engine');

/**
 * Storage engine sending data to a HTTP API via REST calls
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.Rest = function (version) {

    this.stores = {};
    this.manager = null;

};

Sy.Storage.Engine.Rest.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the rest manager
     *
     * @param {Sy.HTTP.REST} manager
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setManager:{
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {

            this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            };

            return this;

        }
    }

});