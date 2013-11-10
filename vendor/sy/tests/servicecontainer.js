describe('service container', function () {

    var container = new Sy.ServiceContainer('test');

    it('should return name', function () {

        expect(container.getName()).toEqual('test');

    });

    it('should change container name', function () {

        expect(container.setName('foo')).toEqual(container);
        expect(container.getName()).toEqual('foo');

    });

    it('should return itself when setting service', function () {

        var val = container.set('foo', function () {});

        expect(val).toEqual(container);

    });

    it('should throw when invalid service name', function () {

        expect(function(){
            container.set('foo.baz');
        }).toThrow();

    });

    it('should throw when invalid creator', function () {

        expect(function(){
            container.set('foo', {});
        }).toThrow();

    });

    it('should throw when constructor args list is not an array', function () {

        expect(function(){
            container.set('foo', function(){}, {});
        }).toThrow();

    });

    it('should throw when unknown service', function () {

        expect(function(){
            container.get('undefined');
        }).toThrow();

    });

    it('should return appropriate object', function () {

        container.set('good', function () {
            return {good: true};
        });

        expect(container.get('good').good).toBe(true);

    });

});