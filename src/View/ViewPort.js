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
    this.mediator = null;
};
Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * Set the mediator to dispatch event when viewscreen is changed
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.View.ViewPort}
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
     * Set the specified view screen name as the current one in the view port
     *
     * @param {string} name ViewScreen name
     *
     * @return {Sy.View.ViewPort}
     */

    display: {
        value: function (name) {

            var viewscreen = this.manager.getViewScreen(name),
                node = viewscreen.getNode();

            if (this.mediator) {
                this.mediator.publish('view::on::pre::display', viewscreen);
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

            if (this.mediator) {
                this.mediator.publish('view::on::post::display', viewscreen);
            }

            return this;

        }
    }

});
