namespace('App.Bundle.Todo.Entity');

App.Bundle.Todo.Entity.Task = function () {
    Sy.Entity.call(this);
};
App.Bundle.Todo.Entity.Task.prototype = Object.create(Sy.Entity.prototype, {

    COMPLETED: {
        value: 'completed',
        writable: false
    },

    ACTIVE: {
        value: 'active',
        writable: false
    },

    setCompleted: {
        value: function () {
            this.set('status', this.COMPLETED);

            return this;
        }
    },

    setActive: {
        value: function () {
            this.set('status', this.ACTIVE);

            return this;
        }
    },

    isCompleted: {
        value: function () {
            return this.get('status') === this.COMPLETED;
        }
    }

});