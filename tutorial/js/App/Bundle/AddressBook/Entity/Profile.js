namespace('App.Bundle.AddressBook.Entity');

App.Bundle.AddressBook.Entity.Profile = function () {
    Sy.Entity.call(this);
    this.firstname = null;
    this.lastname = null;
    this.address = null;
    this.zipcode = null;
    this.city = null;
    this.phone = null;
};
App.Bundle.AddressBook.Entity.Profile.prototype = Object.create(Sy.Entity.prototype);