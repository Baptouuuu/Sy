/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../vendor/Reflection.js/reflection.js
 * @venus-code ../src/PropertyAccessor.js
 */

describe('property accessor', function () {
    var a = new Sy.PropertyAccessor();

    it('should camelize a string', function () {
        expect(a.camelize('fooBar')).toEqual('FooBar');
        expect(a.camelize('foobar')).toEqual('Foobar');
        expect(a.camelize('foo_bar')).toEqual('FooBar');
    });

    it('should explode the path string into it\'s elements', function () {
        expect(a.transform('a.b.c')).toEqual(['a', 'b', 'c']);
    });

    it('should throw if the path is empty or not a string', function () {
        expect(function () {
            a.transform('');
        }).toThrow('Invalid path');
        expect(function () {
            a.transform(null);
        }).toThrow('Invalid path');
    });

    it('should get the value in the object graph', function () {
        var o = {
            a: {
                b: {
                    c: 'foo'
                }
            }
        };

        expect(a.getValue(o, 'a.b.c')).toEqual('foo');
    });

    it('should return undefined if the path is not reachable', function () {
        expect(a.getValue({}, 'a')).toBeUndefined();
    });

    it('should get the value via the getter', function () {
        var O = function () {this.c = 'foo';},
            o = {
                a: {}
            };

        O.prototype = Object.create(Object.prototype, {
            getC: {
                value: function () {
                    return 'bar';
                }
            },
            get: {
                value: function () {
                    return 'd';
                }
            }
        });

        o.a.b = new O();

        expect(a.getValue(o, 'a.b.c')).toEqual('bar');
        expect(a.getValue(o, 'a.b.d')).toEqual('d');
    });

    it('should get the value via the isser', function () {
        var O = function () {this.c = 'foo';},
            o = {
                a: {}
            };

        O.prototype = Object.create(Object.prototype, {
            isC: {
                value: function () {
                    return true;
                }
            }
        });

        o.a.b = new O();

        expect(a.getValue(o, 'a.b.c')).toBe(true);
    });

    it('should get the value via the hasser', function () {
        var O = function () {this.c = 'foo';},
            o = {
                a: {}
            };

        O.prototype = Object.create(Object.prototype, {
            hasC: {
                value: function () {
                    return true;
                }
            }
        });

        o.a.b = new O();

        expect(a.getValue(o, 'a.b.c')).toBe(true);
    });

    it('should get the value without the getter', function () {
        var a = new Sy.PropertyAccessor(true),
            O = function () {this.c = 'foo';},
            o = {
                a: {}
            };

        O.prototype = Object.create(Object.prototype, {
            getC: {
                value: function () {
                    return 'bar';
                }
            }
        });

        o.a.b = new O();

        expect(a.getValue(o, 'a.b.c')).toEqual('foo');
    });

    it('should set the value to the specified path', function () {
        var o = {
            a: {
                b: 'foo'
            }
        };

        a.setValue(o, 'a.b', 'bar');
        expect(o.a.b).toEqual('bar');
    });

    it('should set the value via the setter', function () {
        var O = function () {this.b = 'foo'};
            o = {
                a: null
            };

        O.prototype = Object.create(Object.prototype, {
            setB: {
                value: function (val) {
                    this.b = val + ' via setter';
                }
            }
        });

        o.a = new O();

        expect(a.setValue(o, 'a.b', 'bar')).toEqual(a);
        expect(o.a.b).toEqual('bar via setter');
    });

    it('should set the value without the setter', function () {
        var a = new Sy.PropertyAccessor(true),
            O = function () {this.b = 'foo'};
            o = {
                a: null
            };

        O.prototype = Object.create(Object.prototype, {
            setB: {
                value: function (val) {
                    this.b = val + ' via setter';
                }
            }
        });

        o.a = new O();

        expect(a.setValue(o, 'a.b', 'bar')).toEqual(a);
        expect(o.a.b).toEqual('bar');
    });

    it('should throw if the path is not writable for nested property', function () {
        expect(function () {
            a.setValue({}, 'a.b', 'foo');
        }).toThrow('Path "a.b" not writable');
    });
});
