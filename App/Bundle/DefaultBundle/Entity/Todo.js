namespace('App.Bundle.DefaultBundle.Entity');

App.Bundle.DefaultBundle.Entity.Todo = function (data) {

    Sy.Entity.call(this);

    /*no need to register the uuid attribute, one is automatically registered*/

    this.lock([
        'name',
        'created',
        'sticky',
        'done',
        'updated'
    ]);

    this.set(data);

};

App.Bundle.DefaultBundle.Entity.Todo.prototype = Object.create(Sy.Entity.prototype);