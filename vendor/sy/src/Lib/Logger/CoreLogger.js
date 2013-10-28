namespace('Sy.Lib.Logger');

Sy.Lib.Logger.CoreLogger = function (name) {

    this.name = '';
    this.handlers = {};

    this.setName(name);

};

Sy.Lib.Logger.CoreLogger.prototype = Object.create(Sy.Lib.Logger.Interface.prototype, {

    LOG: {
        value: 'log',
        writable: false
    },

    DEBUG: {
        value: 'debug',
        writable: false
    },

    ERROR: {
        value: 'error',
        writable: false
    },

    INFO: {
        value: 'info',
        writable: false
    },

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    setHandler: {
        value: function (handler, level) {

            if (handler instanceof Sy.Lib.Logger.Handler.Interface && level.toUpperCase() in this) {

                this.handlers[level] = handler;

            }

            return this;

        }
    },

    handle: {
        value: function (level, message, data) {

            if (this.handlers[level]) {

                this.handlers[level].handle(level, message, data);

            }

            return this;

        }
    },

    log: {
        value: function (message, data) {

            this.handle(this.LOG, message, data);

            return this;

        }
    },

    debug: {
        value: function (message, data) {

            this.handle(this.DEBUG, message, data);

            return this;

        }
    },

    error: {
        value: function (message, data) {

            this.handle(this.ERROR, message, data);

            return this;

        }
    },

    info: {
        value: function (message, data) {

            this.handle(this.INFO, message, data);

            return this;

        }
    }

});