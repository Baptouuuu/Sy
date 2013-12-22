namespace('Sy.Storage.Engine');

/**
 * Engine persisiting data to the IndexedDB html5 API
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.IndexedDB = function (version) {

    this.version = version;
    this.connection = null;
    this.transaction = null;
    this.keyRange = null;
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    };
    this.name = 'app::storage';
    this.stores = {};
    this.storage = null;
    this.logger = null;

};

Sy.Storage.Engine.IndexedDB.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the connection object to IndexedDB
     *
     * @param {IDBFactory} connection
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setConnection: {
        value: function (connection) {

            if (!(connection instanceof IDBFactory)) {
                throw new TypeError('Invalid connection');
            }

            this.connection = connection;

            return this;

        }
    },

    /**
     * Set transaction object
     *
     * @param {IDBTransaction} transaction
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setTransaction: {
        value: function (transaction) {

            this.transaction = transaction;
            this.transactionModes = {
                READ_ONLY: this.transaction.READ_ONLY || 'readonly',
                READ_WRITE: this.transaction.READ_WRITE || 'readwrite'
            };

            return this;

        }
    },

    /**
     * Set key range object
     *
     * @param {IDBKeyRange} keyrange
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setKeyRange: {
        value: function (keyrange) {

            this.keyRange = keyrange;

            return this;

        }
    },

    /**
     * Set the database name
     * Default is "app::storage"
     *
     * @param {string} name
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * Set a logger object
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Engine.Interface}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Open a connection to the database
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    open: {
        value: function () {

            var request = this.connection.open(this.name, this.version);

            request.onupgradeneeded = this.upgradeDatabase.bind(this);
            request.onsuccess = function (event) {

                this.storage = event.target.result;
                this.storage.onerror = function (event) {
                    this.logger.error('Database operation failed', event);
                }.bind(this);

                this.logger.info('Database opened');

            }.bind(this);
            request.onerror = function (event) {
                this.logger.error('Database opening failed', event);
            }.bind(this);
            request.onblocked = function (event) {
                this.logger.error('Database opening failed! (blocked by browser setting)', event);
            }.bind(this);

            return this;

        }
    },

    /**
     * Upgrade the definition of the database
     *
     * @param {object} event
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    upgradeDatabase: {
        value: function (event) {

            this.logger.info('Upgrading database...');

            this.storage = event.target.result;

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {

                    var objectStore;

                    store = this.stores[store];

                    if (!this.storage.objectStoreNames.contains(store.path)) {
                        this.storage.createObjectStore(
                            store.path,
                            {
                                keyPath: store.key,
                                autoincrement: false
                            }
                        );
                    }

                    objectStore = event.target.transaction.objectStore(store.path);

                    for (var i = 0, l = objectStore.indexNames.length; i < l; i++) {
                        if (store.indexes.indexOf(objectStore.indexNames[i]) === -1) {
                            objectStore.deleteIndex(objectStore.indexNames[i]);
                        }
                    }

                    for (var j = 0, jl = store.indexes.length; j < jl; j++) {
                        if (!objectStore.indexNames.contains(store.indexes[j])) {
                            objectStore.createIndex(
                                store.indexes[j],
                                store.indexes[j],
                                {unique: false}
                            );
                        }
                    }

                }
            }

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
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_ONLY
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.get(identifier);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Read operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Read operation failed!', e);

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
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.put(object);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Create operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Create operation failed!', e);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (store, identifier, object, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.put(object);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Update operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Update operation failed!', e);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (store, identifier, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.delete(identifier);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Delete operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Delete operation failed!', e);

            }

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
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_ONLY
                    ),
                    objectStore = transaction.objectStore(store.path),
                    index = objectStore.index(args.index),
                    results = [],
                    keyRange,
                    request;

                if (args.value instanceof Array && args.value.length === 2) {

                    if (args.value[0] === undefined) {
                        keyRange = this.keyRange.upperBound(args.value[1]);
                    } else if (args.value[1] === undefined) {
                        keyRange = this.keyRange.lowerBound(args.value[0]);
                    } else {
                        keyRange = this.keyRange.bound(args.value[0], args.value[1]);
                    }

                } else {
                    keyRange = this.keyRange.only(args.value);
                }

                request = index.openCursor(keyRange);

                request.addEventListener('success', function (event) {

                    var result = event.target.result;

                    if (!!result === false) {
                        args.callback(results);
                        return;
                    }

                    results.push(result.value);
                    result.continue();

                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Search operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Search operation failed!', e);

            }

            return this;

        }
    }

});