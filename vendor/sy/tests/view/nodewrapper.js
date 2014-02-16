/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/TemplateEngine.js
 */

describe('view node wrapper', function () {

    var MockEngine = function () {},
        val;

    MockEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {
        render: {
            value: function () {
                val = 'rendered';
            }
        }
    });

    it('should set the dom node', function () {

        var wrapper = new Sy.View.NodeWrapper(),
            node = document.createElement('section');

        wrapper.setNode(node);

        expect(wrapper.getNode()).toEqual(node);

    });

    it('should set the template engine', function () {

        var wrapper = new Sy.View.NodeWrapper(),
            engine = new Sy.View.TemplateEngine();

        expect(wrapper.setTemplateEngine(engine)).toEqual(wrapper);

    });

    it('should throw if invalid engine', function () {

        var wrapper = new Sy.View.NodeWrapper();

        expect(function () {
            wrapper.setTemplateEngine({});
        }).toThrow('Invalid template engine');

    });

    it('should render the node', function () {

        var wrapper = new Sy.View.NodeWrapper();

        wrapper.setTemplateEngine(new MockEngine());
        wrapper.render({some: 'data'});

        expect(val).toEqual('rendered');

    });

});