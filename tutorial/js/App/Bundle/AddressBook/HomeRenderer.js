namespace('App.Bundle.AddressBook');

/**
 * Helper to render the profiles cards on the home page
 */
App.Bundle.AddressBook.HomeRenderer = function () {
    this.viewscreen = null;
    this.router = null;
};
App.Bundle.AddressBook.HomeRenderer.prototype = Object.create(Object.prototype, {

    /**
     * Set the view manager
     */

    setViewManager: {
        value: function (manager) {
            this.viewscreen = manager.getViewScreen('home');
        }
    },

    /**
     * Set the router
     */

    setRouter: {
        value: function (router) {
            this.router = router;
        }
    },

    /**
     * Render the profiles
     *
     * @param {Array} profiles
     */

    renderProfiles: {
        value: function (profiles) {
            var data = [];

            for (var i = 0, l = profiles.length; i < l; i++) {
                data.push({
                    url: this.router.generate(
                        'edit',
                        {id: profiles[i].get('uuid')}
                    ),
                    p: profiles[i]
                });
            }

            this.viewscreen
                .getLayout('body')
                .getList('contacts')
                .render(data);
        }
    }

});