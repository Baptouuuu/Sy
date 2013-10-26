namespace('Sy');

Sy.ServiceContainerInterface = function () {

};

Sy.ServiceContainerInterface.prototype = Object.create(Object.prototype, {

    setName: {
        value: function (name) {

            return this;

        }
    },

    getName: {
        value: function () {}
    },

    set: {
        value: function (name, constructor, data) {

            return this;

        }
    },

    get: {
        value: function (name) {}
    }

});