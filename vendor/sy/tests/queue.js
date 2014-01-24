/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-include ../src/Registry.js
 * @venus-include ../src/FactoryInterface.js
 * @venus-include ../src/RegistryFactory.js
 * @venus-include ../src/QueueInterface.js
 * @venus-include ../src/Queue.js
 */

describe('queue', function () {

    var factory = new Sy.RegistryFactory();

    it('should set an element in a new state', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');

        expect(q.has('foo')).toBe(true);
        expect(q.has('foo', 'bar')).toBe(true);
    });

    it('should return that the key is not setted', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        expect(q.has('foo', 'bar')).toBe(false);

    });

    it('should return that the state is not setted', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        expect(q.has('foo')).toBe(false);

    });

    it('should return the setted value', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');

        expect(q.get('foo', 'bar')).toEqual('baz');

    });

    it('should return an array with the setted value inside', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');

        expect(q.get('foo')).toEqual(['baz']);

    });

    it('should return a list of arrays', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');

        expect(q.get()).toEqual({foo: ['baz']});

    });

    it('should return the state of the key', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');

        expect(q.state('bar')).toEqual('foo');

    });

    it('should return the list of key\'s states', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'bar', 'baz');
        q.set('foobar', 'bar', 'baz');

        expect(q.state('bar')).toEqual(['foo', 'foobar']);

    });

    it('should return undefined for unsetted key', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        expect(q.state('bar')).toEqual(undefined);

    });

    it('should remove an element of a state', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'foo', 'bar');
        q.remove('foo', 'foo');

        expect(q.has('foo', 'foo')).toBe(false);

    });

    it('should remove all elements of a state', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'foo', 'bar');
        q.set('foo', 'bar', 'baz');
        q.remove('foo');

        expect(q.get('foo').length).toEqual(0);

    });

    it('should remove all elements', function () {

        var q = new Sy.Queue();

        q.setRegistryFactory(factory);

        q.set('foo', 'foo', 'bar');
        q.set('bar', 'bar', 'baz');
        q.remove();

        expect(q.get('foo').length).toEqual(0);
        expect(q.get('bar').length).toEqual(0);

    });

});