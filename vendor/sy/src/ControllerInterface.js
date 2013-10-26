namespace('Sy');

Sy.ControllerInterface = function () {

    this.container = {};

};

Sy.ControllerInterface.prototype = Object.create(Object.prototype, {

    getStack: {
        value: function (name) {}
    }

});