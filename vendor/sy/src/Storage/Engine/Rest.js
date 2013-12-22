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

    this.version = version || 1;
    this.stores = {};
    this.manager = null;
    this.basePath = '';

};

Sy.Storage.Engine.Rest.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the pattern of the api url
     * The pattern must at least contain "{{path}}" and "{{key}}" placeholders
     * An extra "{{version}}" placeholder can be set
     *
     * @param {string} pattern
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setPattern: {
        value: function (pattern) {

            if (pattern.indexOf('{{path}}') === -1 || pattern.indexOf('{{key}}') === -1) {
                throw new SyntaxError('Invalid pattern');
            }

            this.basePath = pattern.replace(/{{version}}/, this.version);

            return this;

        }
    },

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
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (store, identifier, callback) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[store];

            this.manager.get({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

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

            var meta = this.stores[store];

            this.manager.post({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, ''),
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

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

            var meta = this.stores[store];

            this.manager.put({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

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

            var meta = this.stores[store];

            this.manager.put({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                listener: function (resp) {

                    callback(identifier);

                }
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (args) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[store],
                queries = [];

            if (args.value instanceof Array) {
                queries.push(args.index + '[]=' + args.value[0] + '&' + args.index + '[]=' + args.value[1]);
            } else {
                queries.push(args.index + '=' + args.value);
            }

            if (args.limit) {
                queries.push('limit=' + args.limit);
            }

            this.manager.get({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, '?' + queries.join('&')),
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

            return this;

        }
    }

});