namespace('Sy.ViewBundle.Subscriber');

/**
 * Listen for app state change to display appropriate viewscreen if available
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.EventDispatcher.EventSubscriberInterface}
 */

Sy.ViewBundle.Subscriber.AppStateSubscriber = function () {
    this.viewport = null;
    this.logger = null;
};
Sy.ViewBundle.Subscriber.AppStateSubscriber.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {

    /**
     * Set the viewport manager
     *
     * @param {Sy.View.ViewPort} viewport
     *
     * @return {Sy.ViewBundle.Subscriber.AppStateSubscriber} self
     */

    setViewPort: {
        value: function (viewport) {
            if (!(viewport instanceof Sy.View.ViewPort)) {
                throw new TypeError('Invalid viewport manager');
            }

            this.viewport = viewport;

            return this;
        }
    },

    /**
     * Set logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.ViewBundle.Subscriber.AppStateSubscriber} self
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
     * @inheritDoc
     */

    getSubscribedEvents: {
        value: function () {
            return {
                'appstate.change': {
                    method: 'onChange'
                }
            };
        }
    },

    /**
     * Called when the appstate.change channel is published
     *
     * @param {Sy.AppState.AppStateEvent} event
     */

    onChange: {
        value: function (event) {
            if (event.getRoute().hasParameter('_viewscreen')) {
                this.logger && this.logger.info(
                    'App state changed, displaying appropriate viewscreen',
                    {route: event.getRoute()}
                );
                this.viewport.display(
                    event.getRoute().getParameter('_viewscreen')
                );
            }
        }
    }

});
