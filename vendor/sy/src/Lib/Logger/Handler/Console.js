namespace('Sy.Lib.Logger.Handler');

Sy.Lib.Logger.Handler.Console = function (level) {

    this.level = null;

    this.setLevel(level);

};

Sy.Lib.Logger.Handler.Console.prototype = Object.create(Sy.Lib.Logger.Handler.Interface.prototype, {

    setLevel: {
        value: function (level) {

            if (!this.checkLevel(level)) {
                throw new TypeError('Unknown logger level');
            }

            this.level = level;

            return this;

        }
    },

    checkLevel: {
        value: function (level) {

            if (level.toUpperCase() in Sy.Lib.Logger.CoreLogger.prototype) {
                return true;
            }

            return false;

        }
    },

    isHandling: {
        value: function (level) {

            if (level === this.level) {
                return true;
            }

            return false;

        }
    },

    handle: {
        value: function (level, message, data) {

            if (this.isHandling(level) && 'console' in window) {

                var output = '[' + moment().format('YYYY-M-D hh:mm:ss') + ']',
                    extra = data || [];

                output += ' ' + message.toString() + ' ' + JSON.stringify(extra);

                console[level](output);

            }

            return this;

        }
    }

});