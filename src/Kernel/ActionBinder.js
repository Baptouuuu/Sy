namespace('Sy.Kernel');

/**
 * Bind referenced actions of a viewscreen node to a controller
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ActionBinder = function () {
    this.mediator = null;
    this.controllers = [];
};
Sy.Kernel.ActionBinder.prototype = Object.create(Object.prototype, {

    /**
     * Set the mediator used for pre/post action events
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.AtionBinder}
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
     * Bind the viewscreen actions to the controller
     *
     * @param {Sy.ControllerInterface} controller
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ActionBinder}
     */

    bind: {
        value: function (controller, viewscreen) {

            if (!(controller instanceof Sy.ControllerInterface)) {
                throw new TypeError('Invalid controller');
            }

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var node = viewscreen.getNode(),
                actions = node.querySelectorAll('[data-sy-action]'),
                refl = new ReflectionObject(controller),
                actionNode,
                action,
                events;

            for (var i = 0, l = actions.length; i < l; i++) {
                actionNode = actions[i];
                action = actionNode.dataset.syAction.split('|')[0] + 'Action';

                if (!refl.hasMethod(action)) {
                    throw new ReferenceError('Undefined method "' + action + '"');
                }

                actionNode.dataset.syControllerIndex = (this.controllers.push(controller) - 1);
                actionNode.dataset.syActionName = action;
                events = actionNode.dataset.syAction.split('|');
                events.splice(0, 1);

                for (var j = 0, jl = events.length; j < jl; j++) {
                    actionNode.addEventListener(events[j], this.eventCallback.bind(this), false);
                }
            }

        }
    },

    /**
     * Event callback used as proxy to the controller action
     *
     * @param {Event} event
     *
     * @return {void}
     */

    eventCallback: {
        value: function (event) {

            var target = event.currentTarget,
                controller = this.controllers[target.dataset.syControllerIndex],
                action = target.dataset.syActioName;

            this.mediator.publish('controller::on::pre::action', controller, action);

            controller[action].call(controller, event);

            this.mediator.publish('controller::on::pre::action', controller, action);

        }
    }

});
