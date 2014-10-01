/**
 * @venus-library jasmine
 * @venus-include ../vendor/underscore/underscore-min.js
 * @venus-include ../src/functions.js
 * @venus-include ../src/ConfiguratorInterface.js
 * @venus-code ../src/Configurator.js
 */

describe('configurator', function () {
    var c;

    beforeEach(function () {
        c = new Sy.Configurator();
    });

    it('should initialize the configurator with an object', function () {
        expect(c.set({
            foo: {
                bar: 'baz'
            }
        })).toBe(c);
        expect(c.get('foo.bar')).toEqual('baz');
    });

    it('should merge the object with the exisiting config', function () {
        c.set({
            foo: 'bar'
        });
        c.set({
            bar: 'baz'
        });

        expect(c.get('bar')).toEqual('baz');
        expect(c.get('foo')).toEqual('bar');
    });

    it('should say it has a key', function () {
        expect(c.has('foo')).toBe(false);
        expect(c.has('bar.baz')).toBe(false);

        c.set({
            foo: 'bar',
            bar: {
                baz: 'foobar'
            }
        });

        expect(c.has('foo')).toBe(true);
        expect(c.has('bar.baz')).toBe(true);
    });

    it('should set the configurator name', function () {
        expect(c.setName('foo')).toBe(c);
        expect(c.getName()).toEqual('foo');
    });

    it('should return the full config object', function () {
        c.set({
            foo: {
                bar: 'baz'
            },
            foobar: 'baz'
        });

        expect(c.get()).toEqual({
            foo: {
                bar: 'baz'
            },
            foobar: 'baz'
        })
    });
});