namespace('App.Bundle.Todo.ViewScreen');

App.Bundle.Todo.ViewScreen.Main = function () {
    Sy.View.ViewScreen.call(this);
};
App.Bundle.Todo.ViewScreen.Main.prototype = Object.create(Sy.View.ViewScreen.prototype, {

    prependTasks: {
        value: function (tasks) {

            var list = this.getLayout('main').getList('tasks');

            for (var i = 0, l = tasks.length; i < l; i++) {
                list.prepend(tasks[i]);
                this.computeCheckbox(tasks[i]);
            }

            this.updateFooter(tasks);

        }
    },

    prependTask: {
        value: function (task) {

            this.getLayout('main')
                .getList('tasks')
                .prepend(task);
            this.getLayout('header')
                .findOne('#new-todo')
                .value = '';

        }
    },

    updateTask: {
        value: function (task) {

            var node = this.getLayout('main')
                    .getList('tasks')
                    .findOne('li[data-uuid="' + task.get('uuid') + '"]');

            this.engine.render(node, task);
            this.computeCheckbox(task);

        }
    },

    removeTask: {
        value: function (uuid) {

            var list = this.getLayout('main')
                .getList('tasks'),
                li = list.findOne('li[data-uuid="' + uuid + '"]');

            list.getNode().removeChild(li);

        }
    },

    computeCheckbox: {
        value: function (task) {

            var checkbox = this.getLayout('main')
                    .getList('tasks')
                    .findOne('.toggle[data-uuid="' + task.get('uuid') + '"]');

            checkbox.checked = task.isCompleted();

        }
    },

    updateFooter: {
        value: function (tasks) {

            var left = 0,
                completed = 0,
                footer = this.getLayout('footer');

            if (tasks.length === 0) {
                footer.getNode().classList.add('hidden');
                return;
            } else {
                footer.getNode().classList.remove('hidden');
            }

            for (var i = 0, l = tasks.length; i < l; i++) {
                if (tasks[i].isCompleted()) {
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

    toggleTaskEdit: {
        value: function (uuid) {
            this.getLayout('main')
                .getList('tasks')
                .findOne('li[data-uuid="' + uuid + '"]')
                .classList.toggle('editing');
        }
    },

    resetUI: {
        value: function () {

            var els = this.viewscreen
                .getLayout('main')
                .getList('tasks')
                .find('.editing');

            for (var i = 0, l = els.length; i < l; i++) {
                els[i].classList.remove('editing');
            }

        }
    }

});
