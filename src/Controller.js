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

            if (!(container instanceof Sy.ServiceContainer.Core)) {
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
    },

    /**
     * Shortcut to create a form builder
     *
     * @param {Object} object Object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (object, options) {
            return this.container
                .get('sy::core::form')
                .createFormBuilder(object, options);
        }
    },

    /**
     * Shortcut to create a form from a form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            return this.container
                .get('sy::core::form')
                .createForm(formType, object, options);
        }
    },

    /**
     * Shortcut to retrieve the storage engine
     *
     * @return {Sy.Storage.Core}
     */

    getStorage: {
        value: function () {
            return this.container.get('sy::core::storage');
        }
    },

    /**
     * Redirect to the specified route name
     *
     * @param {String} route
     * @param {Object} params
     *
     * @return {Sy.Controller} self
     */

    redirect: {
        value: function (route, params) {
            location.hash = this.container
                .get('sy::core::appstate::router')
                .generate(route, params);

            return this;
        }
    }

});