namespace('Sy.Lib.Logger');

/**
 * Default logger of the framework
 *
 * @package Sy
 * @subpackage Lib.Logger
 * @class
 * @implements {Sy.Lib.Logger.Interface}
 *
 * @param {string} name
 */

Sy.Lib.Logger.CoreLogger = function (name) {

    this.name = '';
    this.handlers = {};

    this.setName(name);

};

Sy.Lib.Logger.CoreLogger.prototype = Object.create(Sy.Lib.Logger.Interface.prototype, {

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setHandler: {
        value: function (handler, level) {

            if (handler instanceof Sy.Lib.Logger.Handler.Interface && level.toUpperCase() in this) {

                this.handlers[level] = handler;

            }

            return this;

        }
    },

    /**
     * Transfer the log information to the appropriate handler depending on the level wished
     *
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.CoreLogger}
     */

    handle: {
        value: function (level, message, data) {

            if (this.handlers[level]) {

                this.handlers[level].handle(level, message, data);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    log: {
        value: function (message, data) {

            this.handle(this.LOG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    debug: {
        value: function (message, data) {

            this.handle(this.DEBUG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    error: {
        value: function (message, data) {

            this.handle(this.ERROR, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    info: {
        value: function (message, data) {

            this.handle(this.INFO, message, data);

            return this;

        }
    }

});