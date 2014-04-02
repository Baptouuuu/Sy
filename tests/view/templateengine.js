/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-code ../../src/View/TemplateEngine.js
 * @venus-fixture ../../fixtures/view/templateengine.html
 */

describe('view template engine', function () {

    var engine = new Sy.View.TemplateEngine();

    engine.setRegistry(new Sy.Registry());
    engine.setGenerator(new Sy.Lib.Generator.UUID());

    it('should throw if invalid registry', function () {
        expect(function () {
            engine.setRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should throw if invalid generator', function () {
        expect(function () {
            engine.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should render a nested node', function () {
        var node = document.querySelector('.render-nested-node');

        engine.render(node, {
            element: 42
        });

        expect(node.firstElementChild.textContent).toEqual('foo');
        expect(node.children[1].textContent).toEqual('42');

        engine.render(node, {
            element: 24
        });

        expect(node.children[1].textContent).toEqual('24');
    });

    it('should render dataset', function () {
        var node = document.querySelector('.render-dataset');

        engine.render(node, {
            element: 42
        });

        expect(node.dataset.foo).toEqual('42');

        engine.render(node, {
            element: 24
        });

        expect(node.dataset.foo).toEqual('24');

    });

    it('should render node with nested data', function () {
        var node = document.querySelector('.render-nested-object'),
            mock = function () {this.foo = 42;};

        mock.prototype = Object.create(Object.prototype, {
            getBar: {
                value: function () {
                    return 42;
                }
            },
            get: {
                value: function (prop) {
                    if (prop === 'foo') {
                        return this.foo;
                    } else {
                        return prop;
                    }
                }
            }
        });

        engine.render(node, {
            root: {
                attribute: new mock()
            }
        });

        expect(node.textContent).toEqual('42 42 baz');

        var d = new mock();
        d.foo = 24;

        engine.render(node, {
            root: {
                attribute: d
            }
        });

        expect(node.textContent).toEqual('24 42 baz');

    });

    it('should render multiple placeholders', function () {
        var node = document.querySelector('.render-multiple-placeholders');

        engine.render(node, {
            foo: 'foo',
            bar: 'bar'
        });

        expect(node.textContent).toEqual('foo and bar');

        engine.render(node, {
            foo: 'bar',
            bar: 'foo'
        });

        expect(node.textContent).toEqual('bar and foo');

    });

    it('should render input value', function () {
        var node = document.querySelector('.render-input');

        engine.render(node, {
            value: 42
        });

        expect(node.value).toEqual('42');

        engine.render(node, {
            value: 24
        });

        expect(node.value).toEqual('24');

    });

    it('should render classlist', function () {
        var node = document.querySelector('.render-classlist');

        engine.render(node, {
            classname: 'foo-bar'
        });

        expect(node.className).toEqual('render-classlist foo-bar');

        engine.render(node, {
            classname: 'bar-foo'
        });

        expect(node.className).toEqual('render-classlist bar-foo');

    });

});