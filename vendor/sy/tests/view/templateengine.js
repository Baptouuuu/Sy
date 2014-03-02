/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/TemplateEngine.js
 * @venus-fixture ../../fixtures/view/templateengine.html
 */

describe('view template engine', function () {

    var engine = new Sy.View.TemplateEngine();

    it('should render a nested node', function () {
        var node = document.querySelector('.render-nested-node');

        engine.render(node, {
            element: 42
        });

        expect(node.firstElementChild.textContent).toEqual('foo');
        expect(node.children[1].textContent).toEqual('42');
    });

    it('should render dataset', function () {
        var node = document.querySelector('.render-dataset');

        engine.render(node, {
            element: 42
        });

        expect(node.dataset.foo).toEqual('42');

    });

    it('should render node with nested data', function () {
        var node = document.querySelector('.render-nested-object');

        engine.render(node, {
            root: {
                attribute: 42
            }
        });

        expect(node.textContent).toEqual('42');

    });

    it('should render multiple placeholders', function () {
        var node = document.querySelector('.render-multiple-placeholders');

        engine.render(node, {
            foo: 'foo',
            bar: 'bar'
        });

        expect(node.textContent).toEqual('foo and bar');

    });

    it('should render input value', function () {
        var node = document.querySelector('.render-input');

        engine.render(node, {
            value: 42
        });

        expect(node.value).toEqual('42');

    });

});