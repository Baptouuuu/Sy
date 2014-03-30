namespace('App.Bundle.Todo.Controller');

App.Bundle.Todo.Controller.Main = function () {
    Sy.Controller.call(this);
    this.tasks = null;
    this.repo = null;
    this.templating = null;
};
App.Bundle.Todo.Controller.Main.prototype = Object.create(Sy.Controller.prototype, {

    init: {
        value: function () {
            this.tasks = new Sy.Registry();
            this.repo = this.container
                .get('sy::core::storage')
                .getManager()
                .getRepository('Todo::Task');
            this.templating = this.container
                .get('sy::core::view::template::engine');
            this.repo.findBy({
                index: 'uuid',
                value: [''],
                callback: this.loadPreviousTasks.bind(this)
            });
        }
    },

    loadPreviousTasks: {
        value: function (tasks) {

            for (var i = 0, l = tasks.length; i < l; i++) {
                this.tasks.set(
                    tasks[i].get('uuid'),
                    tasks[i]
                );
                this.viewscreen
                    .getLayout('main')
                    .getList('tasks')
                    .append(tasks[i].get());
            }

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
                this.repo.persist(t);
                this.repo.flush();
                this.tasks.set(
                    t.get('uuid'),
                    t
                );
                event.target.value = null;
                this.viewscreen
                    .getLayout('main')
                    .getList('tasks')
                    .append(t.get());
            }

        }
    },

    listChangesAction: {
        value: function (event) {

            var n = event.target;

            event.preventDefault();

            if (event.type === 'change' && n.classList.contains('toggle')) {
                this.toggleStatus(n);
            } else if (event.type === 'click') {
                if (n.classList.contains('destroy')) {
                    this.removeTask(n);
                }
            }

        }
    },

    toggleStatus: {
        value: function (n) {

            var t = this.tasks.get(n.dataset.uuid);

            event.preventDefault();

            if (n.checked) {
                t.set('status', t.COMPLETED);
            } else {
                t.set('status', t.ACTIVE);
            }

            this.templating.render(
                this.viewscreen
                    .getLayout('main')
                    .getList('tasks')
                    .findOne('li[data-uuid="' + t.get('uuid') + '"]'),
                t.get()
            );

        }
    },

    removeTask: {
        value: function (n) {

            var t = this.tasks.get(n.dataset.uuid),
                list = this.viewscreen.getLayout('main').getList('tasks'),
                node = list.findOne('li[data-uuid="' + t.get('uuid') + '"]');

            this.tasks.remove(t.get('uuid'));
            this.repo.remove(t);
            this.repo.flush();
            list.getNode().removeChild(node);

        }
    }

});