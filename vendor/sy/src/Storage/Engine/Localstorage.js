namespace('Sy.Storage.Engine');

/**
 * Storage engine persisting data into browser LocalStorage API
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.Localstorage = function (version) {

    if (!JSON) {
        throw new Error('JSON object missing! Please load a polyfil in order to use this engine!');
    }

    this.storage = null;
    this.stores = {};
    this.data = null;
    this.storageKey = 'app::storage';

};

Sy.Storage.Engine.Localstorage.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the storage key in LocalStorage
     * If not set, it will use "app::storage"
     *
     * @param {string} storageKey
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    setStorageKey: {
        value: function (storageKey) {

            this.storageKey = storageKey;

            return this;

        }
    },

    /**
     * Set the LocalStorage API object
     *
     * @param {object} storage
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    setStorage: {
        value: function (storage) {

            this.storage = storage;

            return this;

        }
    },

    /**
     * Load data stored in the browser
     * If first time loaded, it creates the storage
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    open: {
        value: function () {

            if (!this.storage) {
                throw new Error('Storage API object missing');
            }

            var data = this.storage.getItem(this.storageKey);

            if (!data) {
                this.createStorage();
            } else {
                this.data = JSON.parse(data);
            }

            return this;

        }
    },

    /**
     * Create the storage
     *
     * @private
     * @return {Sy.Storage.Engine.Localstorage}
     */

    createStorage: {
        value: function () {

            this.data = {};

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    this.data[this.stores[store].path] = {};
                }
            }

            this.flush();

            return this;

        }
    },

    /**
     * Write all the data to the LocalStorage
     *
     * @private
     * @return {Sy.Storage.Engine.Localstorage}
     */

    flush: {
        value: function () {

            this.storage.setItem(this.storageKey, JSON.stringify(this.data));

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
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (store, identifier, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            if (this.data[store.path][identifier]) {
                setTimeout(
                    callback,
                    0,
                    this.data[store.path][identifier]
                );
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (store, object, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            var key = store.key;

            this.data[store.path][object[key]] = object;

            this.flush();

            setTimeout(
                callback,
                0,
                object[key]
            );

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (store, identifier, object, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            this.data[store.path][identifier] = object;

            this.flush();

            setTimeout(
                callback,
                0,
                object
            );

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (store, identifier, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            var key = this.stores[store].key;

            delete this.data[store.path][identifier];

            this.flush();

            setTimeout(
                callback,
                0,
                identifier
            );

            return this;

        }
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {string} store Alias name of the store
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (store, args) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            var data = [];

            for (var key in this.data[store.path]) {
                if (this.data[store.path].hasOwnProperty(key)) {

                    var d = this.data[store.path][key];

                    if (args.value instanceof Array) {

                        if (
                            (
                                args.value[0] === undefined &&
                                d[args.index] <= args.value[1]
                            ) ||
                            (
                                args.value[1] === undefined &&
                                d[args.index] >= args.value[0]
                            ) ||
                            (
                                d[args.index] >= args.value[0] &&
                                d[args.index] <= args.value[1]
                            )
                        ) {
                            data.push(d);
                        }

                    } else if (d[args.index] === args.value) {
                        data.push(d);
                    }

                }
            }

            if (args.limit) {
                data = data.slice(0, args.limit);
            }

            setTimeout(
                args.callback,
                0,
                data
            );

            return this;

        }
    }

});