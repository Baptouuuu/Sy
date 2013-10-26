namespace('App.Bundle.DefaultBundle.Controller');

App.Bundle.DefaultBundle.Controller.Main = function () {

    Sy.Controller.call(this);

    this.todos = this.getStack('todo');

    this.todos.retrieve({                           /*retrieve 42 todos from the server*/
        length: this.ITEMS,
        callback: {
            fn: function () {
                console.log(this.todos.getAll());
            },
            context: this
        }
    });
    this.myService = this.container.get('my::service');

};

App.Bundle.DefaultBundle.Controller.Main.prototype = Object.create(Sy.Controller.prototype, {

    ITEMS: {
        value       : 42,
        writable    : false,
        enumerable  : false
    },

    addAction: {
        value: function (value) {

            var todo = new App.Bundle.DefaultBundle.Entity.Todo({
                name: value
            });

            this.todos.set(todo);   /*add a new entity to the stack*/

            this.todos.flush();     /*tell the stack to apply modifications (create/update/delete) to the storage*/

            this.myService.someMethod();

        }
    }

});