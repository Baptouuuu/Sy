namespace('Sy.View');

/**
 * Default implementation of TemplateEngineInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @implements {Sy.View.TemplateEngineInterface}
 */

Sy.View.TemplateEngine = function () {
    Sy.View.TemplateEngineInterface.call(this);
    this.registry = null;
    this.generator = null;
    this.accessor = new Sy.PropertyAccessor();
};
Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {

    /**
     * Set registry to hold rendered nodes references
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.TemplateEngine}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.registry = registry;

            return this;

        }
    },

    /**
     * Set a generator to identify each rendered node
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.View.TemplateEngine}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    render: {
        value: function (node, data) {

            if (!node.dataset.syUuid) {
                this.register(node);
            }

            if (node.dataset.syUuid && this.registry.has(node.dataset.syUuid)) {
                this.renderAllAttributes(node, data);
                this.renderContent(node, data);
            }

            if (node.childElementCount > 0) {
                for (var i = 0, l = node.childElementCount; i < l; i++) {
                    this.render(node.children[i], data);
                }
            }

            return node;

        }
    },

    /**
     * Set a UUID on the node and set in the registry all the default attributes and text content
     *
     * @private
     * @param {HTMLElement} node
     *
     * @return {Sy.View.TemplateEngine}
     */

    register: {
        value: function (node) {

            var uuid = this.generator.generate(),
                content = {
                    attributes: {},
                    textContent: null,
                    uuid: uuid
                };

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                content.attributes[node.attributes[i].name] = node.getAttribute(node.attributes[i].name);
            }

            content.textContent = node.textContent;
            node.dataset.syUuid = uuid;
            this.registry.set(uuid, content);

            return this;

        }
    },

    /**
     * Loop an all node attributes and render them
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAllAttributes: {
        value: function (node, data) {

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                this.renderAttribute(node, node.attributes[i].name, data);
            }

            return node;

        }
    },

    /**
     * Render a specific attribute on a node
     *
     * @private
     * @param {HTMLElement} node
     * @param {String} attribute
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAttribute: {
        value: function (node, attribute, data) {

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).attributes[attribute],
                text;

            if (!originalContent) {
                return node;
            }

            text = this.replace(originalContent, data);
            node.setAttribute(attribute, text);

            return node;

        }
    },

    /**
     * Replace {{ \w }} with the approriate data
     *
     * @private
     * @param {string} source
     * @param {Object} data
     *
     * @return {string}
     */

    replace: {
        value: function (source, data) {

            while (source.match(this.PATTERN)) {
                var results = this.PATTERN.exec(source);

                if (results !== null && results.length >= 1) {
                    source = source.replace(results[0], this.accessor.getValue(data, results[1]));
                }
            }

            return source;

        }
    },

    /**
     * Replace textContent placeholders by data
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {void}
     */

    renderContent: {
        value: function (node, data) {

            if (node.childElementCount > 0) {
                return node;
            }

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).textContent,
                results = this.PATTERN.exec(originalContent),
                d;

            if (results) {
                d = this.accessor.getValue(data, results[1]);
            }

            if (d instanceof HTMLElement) {
                node.removeChild(node.firstElementChild);
                node.appendChild(d);
            } else {
                node.textContent = this.replace(originalContent, data);
            }

            return node;

        }
    }

});
