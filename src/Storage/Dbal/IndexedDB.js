namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging IndexedDB to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.IndexedDB = function () {
    this.version = 1;
    this.connection = null;
    this.transaction = null;
    this.keyRange = null;
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    };
    this.name = null;
    this.stores = {};
    this.storage = null;
    this.logger = null;
};
Sy.Storage.Dbal.IndexedDB.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the storage name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setVersion: {
        value: function (version) {
            this.version = version || 1;

            return this;
        }
    },

    /**
     * Set the connection object to IndexedDB
     *
     * @param {IDBFactory} conn
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setConnection: {
        value: function (conn) {
            if (!(conn instanceof IDBFactory)) {
                throw new TypeError('Invalid connection');
            }

            this.connection = conn;

            return this;
        }
    },

    /**
     * Set transaction object
     *
     * @param {IDBTransaction} transaction
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setTransaction: {
        value: function (transaction) {
            this.transaction = transaction;
            this.transactionModes.READ_ONLY = transaction.READ_ONLY || 'readonly';
            this.transactionModes.READ_WRITE = transaction.READ_WRITE || 'readwrite';

            return this;
        }
    },

    /**
     * Set key range object
     *
     * @param {IDBKeyRange} keyRange
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setKeyRange: {
        value: function (keyRange) {
            this.keyRange = keyRange;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
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
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     * @param {Array} indexes
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
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
     * Open the connection to the database
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    open: {
        value: function () {
            var request = this.connection.open(this.name, this.version);

            request.onupgradeneeded = this.upgradeDatabase.bind(this);
            request.onsuccess = function (event) {
                this.storage = event.target.result;
                this.storage.onerror = function (event) {
                    this.logger && this.logger.error('Database operation failed', [this.name, event]);
                };

                this.logger && this.logger.info('Database opened', this.name);
            }.bind(this);
            request.onerror = function (event) {
                this.logger && this.logger.error('Database opening failed', [this.name, event]);
            }.bind(this);
            request.onblocked = function (event) {
                this.logger && this.logger.error('Database opening failed! (blocked by browser setting)', [this.name, event]);
            }.bind(this);

            return this;
        }
    },

    /**
     * Upgrade the definition of the database
     *
     * @private
     * @param {Object} event
     */

    upgradeDatabase: {
        value: function (event) {
            var objectStore;

            this.logger && this.logger.info('Upgrading database...', [this.name, this.version]);

            this.storage = event.target.result;

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
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

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.get(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Read operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Read operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
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
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Create operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Create operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
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
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Update operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Update operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
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
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.delete(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));

                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Delete operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Delete operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, indexName, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        index = objectStore.index(indexName),
                        results = [],
                        keyRange,
                        request;

                    if (value instanceof Array && value.length === 2) {

                        if (value[0] === undefined) {
                            keyRange = this.keyRange.upperBound(value[1]);
                        } else if (value[1] === undefined) {
                            keyRange = this.keyRange.lowerBound(value[0]);
                        } else {
                            keyRange = this.keyRange.bound(value[0], value[1]);
                        }

                    } else {
                        keyRange = this.keyRange.only(value);
                    }

                    request = index.openCursor(keyRange);

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            if (limit !== undefined) {
                                resolve(results.slice(0, limit));
                            } else {
                                resolve(results);
                            }
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
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
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.openCursor(),
                        results = [];

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            resolve(results);
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    }

});
