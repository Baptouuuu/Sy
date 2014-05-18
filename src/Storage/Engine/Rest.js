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
    this.mediator = null;
    this.headers = {};
    this.name = 'app::storage';

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

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Set mediator object
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setMediator: {
        value: function (mediator) {

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Set the headers that will be associated to every request made by the engine
     * Useful to set authentication tokens
     *
     * @param {Object} headers
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setHeaders: {
        value: function (headers) {
            this.headers = headers;

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
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName];

            this.manager.get({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
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
        value: function (storeName, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    null,
                    object
                );

            this.mediator.publish(
                evt.PRE_CREATE,
                evt
            );

            this.manager.post({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, ''),
                headers: this.headers,
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                    this.mediator.publish(
                        evt.POST_CREATE,
                        evt
                    );

                }.bind(this)
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, identifier, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    object
                );

            this.mediator.publish(
                evt.PRE_UPDATE,
                evt
            );

            this.manager.put({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                    this.mediator.publish(
                        evt.POST_UPDATE,
                        evt
                    );

                }.bind(this)
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    null
                );

            this.mediator.publish(
                evt.PRE_REMOVE,
                evt
            );

            this.manager.remove({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function (resp) {

                    callback(identifier);

                    this.mediator.publish(
                        evt.POST_REMOVE,
                        evt
                    );

                }.bind(this)
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
                headers: this.headers,
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

            return this;

        }
    }

});