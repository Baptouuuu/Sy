namespace('Sy.Lib.Logger.Handler');

Sy.Lib.Logger.Handler.Interface = function () {

};

Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {

    handle: {
        value: function (message, data) {}
    },

    isHandling: {
        value: function (level) {}
    }

});