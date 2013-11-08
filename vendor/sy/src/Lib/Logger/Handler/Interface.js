namespace('Sy.Lib.Logger.Handler');

/**
 * Interfaces for all loggers' handlers
 *
 * @package Sy
 * @subpackage Lib.Logger.Handler
 * @interface
 */

Sy.Lib.Logger.Handler.Interface = function (level) {

};

Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {

    /**
     * Log the message into the dev tools alongside possible extra data (and the time of the log message).
     * Output the information only if the level is handled by this handler
     *
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Handler.Interface}
     */

    handle: {
        value: function (level, message, data) {}
    },

    /**
     * Check if the wished level is handled by this handler
     *
     * @param {string} level
     *
     * @return {boolean}
     */

    isHandling: {
        value: function (level) {}
    }

});