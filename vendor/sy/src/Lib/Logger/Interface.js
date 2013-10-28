namespace('Sy.Lib.Logger');

Sy.Lib.Logger.Interface = function () {

};

Sy.Lib.Logger.Interface.prototype = Object.create(Object.prototype, {

    setName: {
        value: function () {

            return this;

        }
    },

    log: {
        value: function (message, data) {

            return this;

        }
    },

    debug: {
        value: function (message, data) {

            return this;

        }
    },

    error: {
        value: function (message, data) {

            return this;

        }
    },

    info: {
        value: function (message, data) {

            return this;

        }
    },

    setHandler: {
        value: function (object) {}
    }

});