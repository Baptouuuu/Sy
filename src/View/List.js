namespace('Sy.View');

/**
 * Node wrapper to a view list dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.List = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.elements = [];
    this.types = [];
    this.screen = null;
    this.layout = null;
};
Sy.View.List.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var child;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syList;

            for (var i = 0, l = node.childElementCount; i < l; i++) {
                child = node.firstElementChild;
                this.elements.push(child);
                node.removeChild(child);

                if (this.elements.length > 1 && child.dataset.type === undefined) {
                    throw new SyntaxError('Multiple list elements require a type to be set');
                }

                if (child.dataset.type !== undefined) {
                    if (this.types.indexOf(child.dataset.type) !== -1) {
                        throw new SyntaxError('Multiple list elements defined with the same type');
                    }

                    this.types.push(child.dataset.type);
                }
            }

            return this;

        }
    },

    /**
     * Set the view screen name the list belongs to
     *
     * @param {String} name
     *
     * @return {Sy.View.List} self
     */

    setViewScreenName: {
        value: function (name) {
            this.screen = name;

            return this;
        }
    },

    /**
     * Set the layout name the list belongs to
     *
     * @param {String} name
     *
     * @return {Sy.View.List} self
     */

    setLayoutName: {
        value: function (name) {
            this.layout = name;

            return this;
        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Render a specific element
     *
     * @private
     * @param {Object} data
     * @param {String} type
     *
     * @return {HTMLElement}
     */

    renderElement: {
        value: function (data, type) {

            var idx = type ? this.types.indexOf(type) : 0,
                node;

            if (idx === -1) {
                throw new ReferenceError('The type "' + type + '" does not exist for the list "' + this.getName() + '"');
            }

            if (window.HTMLTemplateElement && this.elements[idx] instanceof HTMLTemplateElement) {
                node = document.importNode(this.elements[idx].content, true);
            } else {
                node = this.elements[idx].cloneNode(true);
            }

            return this.engine.render(node, data);

        }
    },

    /**
     * Append a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    append: {
        value: function (data, type) {

            this.getNode().appendChild(
                this.renderElement(data, type)
            );

            return this;

        }
    },

    /**
     * Prepend a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    prepend: {
        value: function (data, type) {

            this.getNode().insertBefore(
                this.renderElement(data, type),
                this.getNode().firstElementChild
            );

            return this;

        }
    },

    /**
     * Render the list will all the specified data (remove all elements from the list first)
     *
     * @param {Array} data Array of objects (Specify `_type` attribute to reference the type of element to be rendered on each object)
     *
     * @return {Sy.View.List}
     */

    render: {
        value: function (data) {

            var node = this.getNode(),
                d,
                type;

            while (node.firstElementChild) {
                node.removeChild(node.firstElementChild);
            }

            for (var j = 0, jl = data.length; j < jl; j++) {
                d = data[j];
                type = d._type;

                this.append(d, type);
            }

            return this;

        }
    }

});
