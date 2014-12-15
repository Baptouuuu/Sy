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
    this.dispatcher = null;
    this.dispatcherListeners = {};
    this.viewscreen = null;

};

Sy.Controller.prototype = Object.create(Sy.ControllerInterface.prototype, {

    /**
     * @inheritDoc
     */

    listen: {
        value: function (channel, fn) {

            var fn = fn.bind(this);

            this.dispatcher.addListener(
                channel,
                fn
            );

            if (!this.dispatcherListeners[channel]) {
                this.dispatcherListeners[channel] = [];
            }

            this.dispatcherListeners[channel].push(fn);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    broadcast: {
        value: function (name, event) {

            this.dispatcher.dispatch(name, event);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

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

            for (var channel in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.dispatcherListeners[channel].length; i < l; i++) {
                        this.dispatcher.removeListener(channel, this.dispatcherListeners[channel][i]);
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

            for (var channel in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.dispatcherListeners[channel].length; i < l; i++) {
                        this.dispatcher.addListener(channel, this.dispatcherListeners[channel][i]);
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

            for (var channel in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.dispatcherListeners[channel].length; i < l; i++) {
                        this.dispatcher.removeListener(channel, this.dispatcherListeners[channel][i]);
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
