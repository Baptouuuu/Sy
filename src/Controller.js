namespace('Sy');

/**
 * Default implementation of a controller
 *
 * @package Sy
 * @class
 * @implements {Sy.ControllerInterface}
 */

Sy.Controller = function () {

    this.container = null;
    this.mediator = null;
    this.mediatorListeners = {};
    this.bundle = '';
    this.viewscreen = null;

};

Sy.Controller.prototype = Object.create(Sy.ControllerInterface.prototype, {

    /**
     * @inheritDoc
     */

    listen: {
        value: function (channel, fn) {

            var uuid = this.mediator.subscribe({
                channel: channel,
                fn: fn,
                context: this
            });

            if (!this.mediatorListeners[channel]) {
                this.mediatorListeners[channel] = [];
            }

            this.mediatorListeners[channel].push(uuid);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    broadcast: {
        value: function () {

            this.mediator.publish.apply(this.mediator, arguments);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    new: {
        value: function (entity, attributes) {

            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi),
                path = null,
                ent = null;

            if (!regexp.test(entity)) {
                throw new SyntaxError('Invalid entity name format');
            }

            path = entity.split('::');

            if (path.length === 1) {
                ent = new App.Bundle[this.bundle].Entity[path[0]](attributes);
            } else {
                ent = new App.Bundle[path[0]].Entity[path[1]](attributes);
            }

            if (!(ent instanceof Sy.EntityInterface)) {
                throw new TypeError('"' + entity + '" does not implement "Sy.EntityInterface"');
            }

            return ent;

        }
    },

    /**
     * @inheritDoc
     */

    setBundle: {
        value: function (name) {

            if (!App.Bundle[name]) {
                throw new ReferenceError('The bundle "' + name + '" is undefined');
            }

            this.bundle = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    sleep: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.pause(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    wakeup: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.unpause(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */
    destroy: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.remove(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    setViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            this.viewscreen = viewscreen;

            return this;

        }
    }

});