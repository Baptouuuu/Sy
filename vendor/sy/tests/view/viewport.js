/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewPort.js
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

        var manager = new Sy.View.Manager(),
            node = document.createElement('section');

        node.dataset.syViewScreen = 'name';
        manager.setViewScreen(node);

        viewport.setViewManager(manager);

        expect(viewport.getViewManager()).toEqual(manager);

    });

    it('should throw if invalid manager instance', function () {

        expect(function () {
            viewport.setViewManager({});
        }).toThrow('Invalid view manager');

    });

    it('should add a viewscreen to the viewport if not one injected yet', function () {

        var viewportNode = viewport.getNode();

        expect(viewportNode.childElementCount).toEqual(0);

        viewport.display('name');

        expect(viewportNode.childElementCount).toEqual(1);
        expect(viewportNode.children[0]).toEqual(viewport.getViewManager().getViewScreen('name'));

    });

});