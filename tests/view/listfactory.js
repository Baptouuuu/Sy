/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/List.js
 * @venus-include ../../src/View/ListFactoryInterface.js
 * @venus-code ../../src/View/ListFactory.js
 */

describe('view list factory', function () {

    var factory = new Sy.View.ListFactory(),
        MockEngine = function () {},
        MockWrapper = function () {Sy.View.List.call(this)};

    MockEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype);
    MockWrapper.prototype = Object.create(Sy.View.List.prototype);

    factory.setTemplateEngine(new MockEngine());
    factory.setRegistry(new Sy.Registry());

    it('should throw if invalid template engine', function () {
        expect(function () {
            factory.setTemplateEngine({});
        }).toThrow('Invalid template engine');
    });

    it('should return a new list wrapper', function () {
        var node = document.createElement('ul'),
            wrapper;

        node.dataset.syList = 'name';
        wrapper = factory.make(
            'viewscreen name',
            'layout name',
            node
        );

        expect(wrapper instanceof Sy.View.List).toBe(true);
    });

    it('should set a registry to hold custom list wrappers', function () {
        expect(factory.setRegistry(new Sy.Registry())).toEqual(factory);
    });

    it('should throw if invalid registry', function () {
        expect(function () {
            factory.setRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set a new list wrapper', function () {
        var node = document.createElement('section');

        node.dataset.syList = 'wrapper';

        expect(factory.setListWrapper('vs', 'ly', 'wrapper', new MockWrapper())).toEqual(factory);
        expect(factory.make('vs', 'ly', node) instanceof MockWrapper).toBe(true);
    });

    it('should throw if list wrapper already taken', function () {
        expect(function () {
            factory.setListWrapper('vs', 'ly', 'wrapper', new MockWrapper());
        }).toThrow('A list wrapper is already defined with the name "vs::ly::wrapper"');
    });

    it('should throw if setting invalid wrapper', function () {
        expect(function () {
            factory.setListWrapper('in', 'in', 'name', {});
        }).toThrow('Invalid list wrapper');
    });

});