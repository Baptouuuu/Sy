namespace('Sy.Lib.Logger.Handler');

Sy.Lib.Logger.Handler.Interface = function () {

};

Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {

    handle: {
        value: function (records) {}
    },

    isHandling: {
        value: function (level) {}
    }

});