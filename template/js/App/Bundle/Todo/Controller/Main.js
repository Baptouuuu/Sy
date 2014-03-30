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

            this.computeCheckboxes();
            this.updateFooter();

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
                this.updateFooter();
            }

        }
    },

    listChangesAction: {
        value: function (event) {

            var n = event.target;

            if (event.type === 'submit') {
                event.preventDefault();
            }

            if (event.type === 'change' && n.classList.contains('toggle')) {
                this.toggleStatus(
                    n.dataset.uuid,
                    n.checked ?
                        'COMPLETED' :
                        'ACTIVE'
                );
            } else if (event.type === 'click') {
                if (n.classList.contains('destroy')) {
                    this.removeTask(n.dataset.uuid);
                }
            }

        }
    },

    toggleStatus: {
        value: function (uuid, status) {

            var t = this.tasks.get(uuid);

            t.set('status', t[status]);
            this.repo.persist(t);
            this.repo.flush();

            this.templating.render(
                this.viewscreen
                    .getLayout('main')
                    .getList('tasks')
                    .findOne('li[data-uuid="' + t.get('uuid') + '"]'),
                t.get()
            );
            this.updateFooter();

        }
    },

    removeTask: {
        value: function (uuid) {

            var t = this.tasks.get(uuid),
                list = this.viewscreen.getLayout('main').getList('tasks'),
                node = list.findOne('li[data-uuid="' + t.get('uuid') + '"]');

            this.tasks.remove(t.get('uuid'));
            this.repo.remove(t);
            this.repo.flush();
            list.getNode().removeChild(node);

        }
    },

    markAllAsReadAction: {
        value: function (event) {

            var n = event.target,
                checkboxes,
                status;

            if (n.checked) {
                status = 'COMPLETED';
            } else {
                status = 'ACTIVE';
            }

            this.tasks.get().forEach(function (task) {
                this.toggleStatus(
                    task.get('uuid'),
                    status
                );
            }, this);

            this.computeCheckboxes();
        }
    },

    computeCheckboxes: {
        value: function () {

            var checkboxes = this.viewscreen
                .getLayout('main')
                .getList('tasks')
                .find('.toggle'),
                task;

            for (var i = 0, l = checkboxes.length; i < l; i++) {
                task = this.tasks.get(checkboxes[i].dataset.uuid);

                checkboxes[i].checked = task.get('status') === task.COMPLETED ?
                    true :
                    false;
            }

        }
    },

    updateFooter: {
        value: function () {

            var left = 0,
                completed = 0,
                tasks = this.tasks.get(),
                footer = this.viewscreen.getLayout('footer');

            if (tasks.length === 0) {
                footer.getNode().classList.add('hidden');
                return;
            } else {
                footer.getNode().classList.remove('hidden');
            }

            for (var i = 0, l = tasks.length; i < l; i++) {
                if (tasks[i].get('status') === tasks[i].COMPLETED) {
                    completed++;
                } else {
                    left++;
                }
            }

            footer.render({
                left: left.toString(),
                completed: completed.toString()
            });

        }
    },

    removeAllAction: {
        value: function (event) {

            if (this.tasks.length() === 0) {
                return;
            }

            this.tasks.get().forEach(function (task) {
                if (task.get('status') === task.COMPLETED) {
                    this.removeTask(task.get('uuid'));
                }
            }, this);

            this.updateFooter();

        }
    }

});