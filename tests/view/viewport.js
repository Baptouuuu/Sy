/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/Manager.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-include ../../src/View/Event/ViewPortEvent.js
 * @venus-code ../../src/View/ViewPort.js
 */

describe('viewport', function () {

    var viewport = new Sy.View.ViewPort();

    it('should set the viewport dom node', function () {

        var node = document.createElement('section');

        node.classList.add('viewport');

        viewport.setNode(node);

        expect(viewport.getNode()).toEqual(node);

    });

    it('should set the view manager', function () {

        var manager = new Sy.View.Manager();

        viewport.setViewManager(manager);

        expect(viewport.getViewManager()).toEqual(manager);

    });

    it('should throw if invalid manager instance', function () {

        expect(function () {
            viewport.setViewManager({});
        }).toThrow('Invalid manager');

    });

    it('should add a viewscreen to the viewport if not one injected yet', function () {

        var viewportNode = viewport.getNode(),
            viewscreen = new Sy.View.ViewScreen(),
            node = document.createElement('section');

        node.dataset.syView = 'name';
        viewscreen.node = node;

        Sy.View.Manager.prototype = Object.create(Sy.View.Manager.prototype, {
            getViewScreen: {
                value: function () {
                    return viewscreen;
                }
            }
        });

        viewport.setViewManager(new Sy.View.Manager());

        expect(viewportNode.childElementCount).toEqual(0);

        viewport.display('name');

        expect(viewportNode.childElementCount).toEqual(1);
        expect(viewportNode.children[0]).toEqual(viewport.getViewManager().getViewScreen('name').getNode());

    });

    it('should return the current viewscreen', function () {
        expect(viewport.getCurrentViewScreen() instanceof Sy.View.ViewScreen).toBe(true);
    });

});