namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Create = function () {};
App.Bundle.AddressBook.Controller.Create.prototype = Object.create(Sy.Controller.prototype, {

    createAction: {
        value: function (event) {
            var form = this.createForm('profile');

            form.handle(
                this.viewscreen.getForm()
            )

            if (form.isValid()) {
                var entity = form.getObject();

                if (entity.hasPicture()) {
                    entity.setPictureFile(
                        this.viewscreen.getPictureFile()
                    );
                }

                this.getStorage()
                    .getManager()
                    .persist(entity)
                    .flush();

                this.viewscreen.resetForm();

                setTimeout(function () {
                    this.redirect('home');
                }.bind(this), 50);
            } else {
                this.viewscreen
                    .displayErrorMessage();
            }
        }
    }

});