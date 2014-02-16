/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 */

describe('viewscreen', function () {

    var viewscreen = new Sy.View.ViewScreen(),
        node = document.createElement('section'),
        MockEngine = function () {},
        val;

    MockEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {
        render: {
            value: function () {
                val = 'rendered';
            }
        }
    });

    node.dataset.syViewScreen = 'name';
    viewscreen.setNode(node);

    it('should return the name', function () {

        expect(viewscreen.getName()).toEqual('name');

    });

    it('should render the node', function () {

        viewscreen.setTemplateEngine(new MockEngine());
        viewscreen.render({some: 'data'});

        expect(val).toEqual('rendered');

    });

    it('should return the list of layouts', function () {

        expect(viewscreen.getLayouts() instanceof Array).toBe(true);
        expect(viewscreen.getLayouts().length).toEqual(0);

    });

});