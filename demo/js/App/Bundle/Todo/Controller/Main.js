namespace('App.Bundle.Todo.Controller');

App.Bundle.Todo.Controller.Main = function () {
    Sy.Controller.call(this);
    this.tasks = null;
    this.repo = null;
    this.em = null;
};
App.Bundle.Todo.Controller.Main.prototype = Object.create(Sy.Controller.prototype, {

    init: {
        value: function () {
            this.tasks = new Sy.Registry();
            this.em = this.getStorage().getManager();
            this.repo = this.em.getRepository('Todo::Task');
            this.em
                .getDriver()
                .whenOpened()
                .then(function () {
                    return this.repo.findAll();
                }.bind(this))
                .then(this.loadPreviousTasks.bind(this));
        }
    },

    loadPreviousTasks: {
        value: function (tasks) {

            for (var i = 0, l = tasks.length; i < l; i++) {
                this.tasks.set(
                    tasks[i].get('uuid'),
                    tasks[i]
                );
            }

            this.viewscreen.prependTasks(tasks);

        }
    },

    newAction: {
        value: function (event) {

            if (event.keyCode === 13 && event.target.value.trim() !== '') {
                var t = this.new('Todo::Task', {});
                t.set({
                    name: event.target.value,
                    status: t.ACTIVE
                });
                this.em.persist(t);
                this.em.flush();
                this.tasks.set(
                    t.get('uuid'),
                    t
                );
                this.viewscreen.prependTask(t);
                this.viewscreen.updateFooter(this.tasks.get());
            }

        }
    },

    listChangesAction: {
        value: function (event) {

            var n = event.target;

            if (event.type === 'submit') {
                event.preventDefault();
                this.viewscreen.resetUI();
            }

            if (event.type === 'change' && n.classList.contains('toggle')) {
                this.toggleStatus(n.dataset.uuid, n.checked);
                this.viewscreen.updateFooter(this.tasks.get());
                this.em.flush();
            } else if (event.type === 'click') {
                if (n.classList.contains('destroy')) {
                    this.removeTask(n.dataset.uuid);
                    this.em.flush();
                }
            } else if (event.type === 'dblclick') {
                if (n.nodeName === 'LABEL') {
                    this.viewscreen.toggleTaskEdit(n.dataset.uuid);
                }
            } else if (event.type === 'change' && n.classList.contains('edit')) {
                this.viewscreen.toggleTaskEdit(n.dataset.uuid);
                this.updateTask(n.dataset.uuid, n.value);
                this.em.flush();
            }


        }
    },

    toggleStatus: {
        value: function (uuid, checked) {

            var t = this.tasks.get(uuid);

            if (checked) {
                t.setCompleted();
            } else {
                t.setActive();
            }
            this.em.persist(t);

            this.viewscreen.updateTask(t);

        }
    },

    removeTask: {
        value: function (uuid) {

            var t = this.tasks.get(uuid);

            this.tasks.remove(t.get('uuid'));
            this.em.remove(t);
            this.viewscreen.removeTask(uuid);

            this.viewscreen.updateFooter(this.tasks.get());

        }
    },

    markAllAsReadAction: {
        value: function (event) {

            this.tasks.get().forEach(function (task) {
                this.toggleStatus(
                    task.get('uuid'),
                    event.target.checked
                );
            }, this);

            this.viewscreen.updateFooter(this.tasks.get());
            this.em.flush();
        }
    },

    removeAllAction: {
        value: function (event) {

            if (this.tasks.length() === 0) {
                return;
            }

            this.tasks.get().forEach(function (task) {
                if (task.isCompleted()) {
                    this.tasks.remove(task.get('uuid'));
                    this.em.remove(task);
                    this.viewscreen.removeTask(task.get('uuid'));
                }
            }, this);
            this.viewscreen.updateFooter(this.tasks.get());
            this.em.flush();

        }
    },

    updateTask: {
        value: function (uuid, value) {

            var task = this.tasks.get(uuid);

            task.set('name', value);
            this.viewscreen.updateTask(task);

            this.em.persist(task);

        }
    }

});