namespace('Sy.View');

/**
 * Top class to access the view mechanism and handle the app viewport
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.ViewPort = function () {
    this.node = null;
    this.manager = null;
    this.dispatcher = null;
    this.current = null;
};
Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * Set the event dispatcher to dispatch event when viewscreen is changed
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.View.ViewPort}
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
     * Set the view port node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.ViewPort}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement) || !node.classList.contains('viewport')) {
                throw new TypeError('Invalid node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Set the view manager
     *
     * @param {Sy.View.Manager} manager
     *
     * @return {Sy.View.ViewPort}
     */

    setViewManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.View.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Return the view manager
     *
     * @return {Sy.View.Manager}
     */

    getViewManager: {
        value: function () {
            return this.manager;
        }
    },

    /**
     * Return the current viewscreen being displayed
     *
     * @return {Sy.View.ViewScreen}
     */

    getCurrentViewScreen: {
        value: function () {

            if (this.current === null && this.node.childElementCount === 1) {
                this.current = this.manager.getViewScreen(
                    this.node.firstElementChild.dataset.syView
                );
            }

            return this.current;

        }
    },

    /**
     * Set the specified view screen name as the current one in the view port
     *
     * @param {string} name ViewScreen name
     *
     * @return {Sy.View.ViewPort}
     */

    display: {
        value: function (name) {

            var viewscreen = this.manager.getViewScreen(name),
                node = viewscreen.getNode(),
                event = new Sy.View.Event.ViewPortEvent(viewscreen);

            if (this.dispatcher) {
                this.dispatcher.dispatch(event.PRE_DISPLAY, event);
            }

            switch (this.node.childElementCount) {
                case 0:
                    this.node.appendChild(node);
                    break;
                case 1:
                    this.node.replaceChild(node, this.node.children[0]);
                    break;
                default:
                    throw new Error('Viewport in weird state (more than 1 child)');
            }

            this.current = viewscreen;

            if (this.dispatcher) {
                event = new Sy.View.Event.ViewPortEvent(viewscreen);
                this.dispatcher.dispatch(event.POST_DISPLAY, event);
            }

            return this;

        }
    }

});
