namespace('Sy');

Sy.EntityInterface = function () {

};

Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    set: {
        value: function (attr, value) {

            return this;

        }
    },

    get: {
        value: function (attr) {}
    },

    register: {
        value: function (attr) {}
    }

});