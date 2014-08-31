namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging HTTP to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Rest = function () {
    this.pattern = null;
    this.version = 1;
    this.connection = null;
    this.logger = null;
    this.headers = {};
    this.stores = {};
};
Sy.Storage.Dbal.Rest.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the url pattern
     *
     * @param {String} pattern
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setURLPattern: {
        value: function (pattern) {
            if (!(/.*\/$/).test(pattern)) {
                pattern += '/';
            }

            this.pattern = pattern;

            return this;
        }
    },

    /**
     * Set the version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setVersion: {
        value: function (version) {
            if (this.pattern) {
                this.pattern = this.pattern.replace('{version}', version);
            }

            this.version = version;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setConnection: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.connection = rest;

            return this;
        }
    },

    /**
     * Set a header to be passed on each http request
     *
     * @param {String} name
     * @param {String} value
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setVersionHeader: {
        value: function (name, value) {
            this.headers[name] = value;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} bundle
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setStore: {
        value: function (alias, bundle, name, identifier) {
            this.stores[alias] = {
                bundle: bundle,
                name: name,
                key: identifier,
                path: this.urlPattern
                    .replace('{bundle}', bundle)
                    .replace('{name}', name)
                    .replace('{bundle|lower}', bundle.toLowerCase())
                    .replace('{name|lower}', name.toLowerCase())
            };

            return this;
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

                this.connection.get({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode().toString() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
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

                this.connection.post({
                    uri: store.path,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_CREATED) {
                            resolve(resp.getBody()[store.key]);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
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

                this.connection.put({
                    uri: store.path + id,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_CREATED
                        ) {
                            resolve(resp.getBody());
                        } else if (resp.getStatusCode() === resp.HTTP_NO_CONTENT) {
                            resolve(object);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
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

                this.connection.remove({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_ACCEPTED ||
                            resp.getStatusCode() === resp.HTTP_NO_CONTENT
                        ) {
                            resolve()
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }
                });
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
                    path = store.path;

                path += '?' + index + '=' + value;

                if (limit !== undefined) {
                    path += '&limit=' + limit;
                }

                this.connection.get({
                    uri: encodeURI(path),
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
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

                var store = this.stores[storeName];

                this.connection.get({
                    uri: store.path,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    }

});
