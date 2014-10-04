namespace('App.Bundle.AddressBook.Entity');

App.Bundle.AddressBook.Entity.Profile = function () {
    Sy.Entity.call(this);
    this.firstname = null;
    this.lastname = null;
    this.fullname = null;
    this.address = null;
    this.zipcode = null;
    this.city = null;
    this.phone = null;
    this.picture = null;
};
App.Bundle.AddressBook.Entity.Profile.prototype = Object.create(Sy.Entity.prototype, {

    INDEXES: {
        value: ['fullname']
    },

    /**
     * Check if the picture is set
     *
     * @return {Boolean}
     */

    hasPicture: {
        value: function () {
            return !!this.picture;
        }
    },

    /**
     * Replace the fake picture path by the image file
     *
     * @param {File} picture
     *
     * @return {App.Bundle.AddressBook.Entity.Profile} self
     */

    setPictureFile: {
        value: function (picture) {
            this.picture = picture;

            return this;
        }
    },

    /**
     * Return the picture blob url
     *
     * @return {String}
     */

    getPictureUrl: {
        value: function () {
            if (this.picture instanceof Blob) {
                return URL.createObjectURL(this.picture);
            } else {
                return 'http://www.gravatar.com/avatar/00000000000000000000000000000000?s=125';
            }
        }
    },

    /**
     * Return the firstname + the lastname
     *
     * @return {String}
     */

    getFullname: {
        value: function () {
            return this.firstname + ' ' + this.lastname;
        }
    },

    /**
     * Prevent to actually set the fullname
     *
     * @param {String} fullname
     *
     * @return {App.Bundle.AddressBook.Entity.Profile} self
     */

    setFullname: {
        value: function (fullname) {
            return this;
        }
    }

});