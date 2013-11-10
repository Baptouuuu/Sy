describe('functions', function () {

    it('should create two sub-objects of window', function () {

        namespace('Foo.Bar');

        expect(window.Foo).not.toBe(undefined);
        expect(window.Foo.Bar).not.toBe(undefined);

        delete window.Foo;

    });

    it('should create two sub-objects of own object', function () {

        var custom = {};

        namespace.call(custom, 'Foo.Bar');

        expect(custom.Foo).not.toBe(undefined);
        expect(custom.Foo.Bar).not.toBe(undefined);

    });

});