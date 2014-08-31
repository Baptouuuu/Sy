namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging Storage to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Localstorage = function () {
    this.storage = null;
    this.stores = {};
    this.data = null;
    this.name = null;
};
Sy.Storage.Dbal.Localstorage.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the database name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage connection
     *
     * @param {Storage} storage
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setConnection: {
        value: function (storage) {
            if (!(storage instanceof Storage)) {
                throw new TypeError('Invalid storage');
            }

            this.storage = storage;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setStore: {
        value: function (alias, name, identifier) {
            this.stores[alias] = {
                path: name,
                key: identifier
            };

            return this;
        }
    },

    /**
     * Open the storage and load the data
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    open: {
        value: function () {
            var data = this.storage.getItem(this.name);

            if (!data) {
                this.createStorage();
            } else {
                this.data = JSON.parse(data);
            }

            return this;
        }
    },

    /**
     * Initialize the database structure
     *
     * @private
     */

    createStorage: {
        value: function () {
            this.data = {};

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    this.data[this.stores[store].path] = {};
                }
            }

            this.commit();

            return this;
        }
    },

    /**
     * Write the data to the database
     *
     * @private
     */

    commit: {
        value: function () {
            this.storage.setItem(this.name, JSON.stringify(this.data));
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName];

                if (this.data[store.path].hasOwnProperty(id)) {
                    setTimeout(function () {
                        resolve(this.data[store.path][id]);
                    }.bind(this), 0);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName];

                this.data[store.path][object[store.key]] = object;
                this.commit();

                setTimeout(function () {
                    resolve(object[store.key]);
                }.bind(this), 0);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName];

                this.data[store.path][id] = object;
                this.commit();

                setTimeout(function () {
                    resolve(object);
                }.bind(this), 0);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName];

                delete this.data[store.path][id];
                this.commit();

                setTimeout(function () {
                    resolve();
                }.bind(this), 0);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, index, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName],
                    data = [],
                    d;

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        d = this.data[store.path][key];

                        if (value instanceof Array) {
                            if (
                                (
                                    value[0] === undefined &&
                                    d[index] <= value[1]
                                ) ||
                                (
                                    value[1] === undefined &&
                                    d[index] >= value[0]
                                ) ||
                                (
                                    d[index] >= value[0] &&
                                    d[index] <= value[1]
                                )
                            ) {
                                data.push(d);
                            }

                        } else if (d[index] === value) {
                            data.push(d);
                        }
                    }
                }

                if (limit !== undefined) {
                    data = data.slice(0, limit);
                }

                setTimeout(function () {
                    resolve(data);
                }.bind(this), 0);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName],
                    data = [];

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        data.push(this.data[store.path][key]);
                    }
                }

                setTimeout(function () {
                    resolve(data);
                }.bind(this), 0);
            }.bind(this));
        }
    }

});
