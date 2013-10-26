namespace('Sy');

Sy.ConfiguratorInterface = function () {

    this.name = '';

};

Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {

    set: {
        value: function (key, value) {

            return this;

        }
    },

    get: {
        value: function (key) {

            return this;

        }
    },

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    getName: {
        value: function () {

            return this.name;

        }
    }

});