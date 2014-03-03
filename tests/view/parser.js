/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/Parser.js
 * @venus-fixture ../../fixtures/view/parser.html
 */

describe('view parser', function () {

    var parser = new Sy.View.Parser();

    it('should return a list of viewscreen sections', function () {

        var viewscreens = parser.getViewScreens();

        expect(viewscreens instanceof NodeList).toBe(true);
        expect(viewscreens.length).toEqual(2);

        for (var i = 0; i < 2; i++) {
            expect(viewscreens[i].dataset.syView).not.toEqual(undefined);
        }

    });

    it('should return a list of layout sections', function () {

        var viewscreen = parser.getViewScreens()[0],
            layouts = parser.getLayouts(viewscreen);

        expect(layouts instanceof NodeList).toBe(true);
        expect(layouts.length).toEqual(2);

        for (var i = 0; i < 2; i++) {
            expect(layouts[i].dataset.syLayout).not.toEqual(undefined);
        }

    });

    it('should return a list of list sections', function () {

        var viewscreen = parser.getViewScreens()[0],
            layout = parser.getLayouts(viewscreen)[0],
            lists = parser.getLists(layout);

        expect(lists instanceof NodeList).toBe(true);
        expect(lists.length).toEqual(2);

        for (var i = 0; i < 2; i++) {
            expect(lists[i].dataset.syList).not.toEqual(undefined);
        }

    });

});