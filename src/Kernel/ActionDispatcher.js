namespace('Sy.Kernel');

/**
 * Bind itself to referenced viewscreen actions and
 * re-route handling to the appropriate controller
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ActionDispatcher = function () {
    this.viewport = null;
    this.controllerManager = null;
    this.mediator = null;
    this.logger = null;
};
Sy.Kernel.ActionDispatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the viewport wrapper
     *
     * @param {Sy.View.ViewPort} viewport
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setViewPort: {
        value: function (viewport) {

            if (!(viewport instanceof Sy.View.ViewPort)) {
                throw new TypeError('Invalid viewport');
            }

            this.viewport = viewport;

            return this;

        }
    },

    /**
     * Set the controller manager
     *
     * @param {Sy.Kernel.ControllerManager} manager
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setControllerManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.Kernel.ControllerManager)) {
                throw new TypeError('Invalid controller manager');
            }

            this.controllerManager = manager;

            return this;

        }
    },

    /**
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.ActionDispatcher}
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
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Kernel.ActionDispatcher}
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
     * Bind viewscreens actions to the dispatcher
     *
     * @param {Array} viewscreens Array of all viewscreens
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreens: {
        value: function (viewscreens) {

            for (var i = 0, l = viewscreens.length; i < l; i++) {
                this.bindViewScreen(viewscreens[i]);
            }

            return this;

        }
    },

    /**
     * Bind registered actions of a viewscreen to this dispatcher
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var node = viewscreen.getNode(),
                actions = node.querySelectorAll('[data-sy-action]'),
                actionNode,
                events;

            if (this.logger) {
                this.logger.info('Binding the viewscreen "' + node.dataset.syView + '" actions to the dispatcher...', viewscreen);
            }

            for (var i = 0, l = actions.length; i < l; i++) {
                actionNode = actions[i];

                events = actionNode.dataset.syAction.split('|');
                events.splice(0, 1);

                for (var j = 0, jl = events.length; j < jl; j++) {
                    actionNode.addEventListener(events[j], this.eventCallback.bind(this), false);
                }
            }

        }
    },

    /**
     * Event callback used to re-route action to the wished controller
     *
     * @param {Event} event
     */

    eventCallback: {
        value: function (event) {

            var target = event.currentTarget,
                alias = this.viewport
                    .getCurrentViewScreen()
                    .getNode()
                    .dataset
                    .syController,
                action = target.dataset.syAction.split('|')[0] + 'Action',
                controller,
                evt;

            if (!this.controllerManager.isControllerBuilt(alias)) {
                this.controllerManager.buildController(
                    this.viewport.getCurrentViewScreen()
                );
            }

            controller = this.controllerManager.getController(alias);
            evt = new Sy.Event.ControllerEvent(controller, action, event);

            if (this.logger) {
                this.logger.info('Firing a controller\'s method...', [controller, action]);
            }

            this.mediator.publish(evt.PRE_ACTION, evt);

            controller[action].call(controller, event);

            this.mediator.publish(evt.POST_ACTION, evt);

        }
    }

});
