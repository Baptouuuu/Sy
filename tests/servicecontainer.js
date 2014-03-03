/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/ServiceContainerInterface.js
 * @venus-include ../src/ServiceContainer.js
 */

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

    it('should have the service container as service constructor function context', function () {

        container.set('context', function () {
            expect(this).toEqual(container);
            return {};
        });

        container.get('context');

    });

    it('should return that a service is set', function () {

        container.set('some::service', function () {
            return {};
        });

        expect(container.has('some::service')).toBe(true);
        container.get('some::service');
        expect(container.has('some::service')).toBe(true);

    });

    it('should return that a service does not exist', function () {

        expect(container.has('unknown')).toBe(false);

    });

    it('should throw that a service already exist', function () {

        container.set('duplicate', function () {});

        expect(function () {
            container.set('duplicate', function () {});
        }).toThrow();

    });

    it('should register a service definition', function () {

        A = function A () {};

        container.set({
            'definition': {
                constructor: 'A'
            }
        });

        expect(container.get('definition') instanceof A).toBe(true);

    });

    it('should register a service definition with calls', function () {

        B = function B () {
            this.c = null;
        };
        C = function C () {};

        B.prototype = {
            setter: function (c) {
                this.c = c;
            }
        };

        container.set({
            'c': {
                constructor: 'C'
            },
            'b': {
                constructor: 'B',
                calls: [
                    ['setter', ['@c']]
                ]
            }
        });

        expect(container.get('b').c instanceof C).toBe(true);

    });

    it('should register a service definition with parameter as call argument', function () {

        D = function D () {
            this.val = null;
        };
        D.prototype = {
            setter: function (val) {
                this.val = val;
            }
        };

        container
            .setParameters({
                paramName: 42
            })
            .set({
                'args': {
                    constructor: 'D',
                    calls: [
                        ['setter', ['%paramName%']]
                    ]
                }
            });

        expect(container.get('args').val).toEqual(42);

    });

    it('should throw that the service name does not comply with the convention', function () {

        expect(function () {
            container.set('foo-bar', function () {});
        }).toThrow();
        expect(function () {
            container.set({
                'foo-baz': {
                    constructor: 'A'
                }
            });
        }).toThrow();

    });

    it('should return a parameter', function () {

        container.setParameters({
            foo: {
                bar: 42
            }
        });

        expect(container.getParameter('foo.bar')).toEqual(42);

    });

});