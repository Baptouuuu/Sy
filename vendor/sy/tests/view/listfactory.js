/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/List.js
 * @venus-include ../../src/View/ListFactoryInterface.js
 * @venus-include ../../src/View/ListFactory.js
 */

describe('view list factory', function () {

    var factory = new Sy.View.ListFactory(),
        MockEngine = function () {};

    MockEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype);

    factory.setTemplateEngine(new MockEngine());

    it('should return a new list wrapper', function () {
        var node = document.createElement('ul'),
            wrapper;

        node.dataset.syList = 'name';
        wrapper = factory.make(node);

        expect(wrapper instanceof Sy.View.List).toBe(true);
    });

});