namespace('Sy');

Sy.StackInterface = function () {

};

Sy.StackInterface.prototype = Object.create(Object.prototype, {

    setName: {
        value: function (name) {

            return this;

        }
    },

    retrieve: {
        value: function () {

            return this;

        }
    },

    get: {
        value: function (key) {}
    },

    getAll: {
        value: function () {}
    },

    persist: {
        value: function (entity) {

            return this;

        }
    },

    remove: {
        value: function (key) {

            return this;

        }
    },

    clear: {
        value: function () {

            return this;

        }
    },

    flush: {
        value: function () {

            return this;

        }
    },

    contains: {
        value: function (key) {}
    }

});