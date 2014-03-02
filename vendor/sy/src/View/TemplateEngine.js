namespace('Sy.View');

/**
 * Default implementation of TemplateEngineInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @implements {Sy.View.TemplateEngineInterface}
 */

Sy.View.TemplateEngine = function () {};
Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {

    /**
     * @inheritDoc
     */

    render: {
        value: function (node, data) {

            this.replaceDataset(node, data);

            if (node.childElementCount === 0) {
                this.replaceContent(node, data);

                if (node instanceof HTMLInputElement) {
                    this.replaceElementValue(node, data);
                }

            } else {
                for (var i = 0, l = node.childElementCount; i < l; i++) {
                    this.render(node.children[i], data);
                }
            }

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
                    source = source.replace(results[0], objectGetter.call(data, results[1]) || '');
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

    replaceContent: {
        value: function (node, data) {

            if (
                node.textContent &&
                !(node instanceof HTMLInputElement) &&
                (
                    node.textContent.match(this.PATTERN) ||
                    (
                        node.dataset.originalContent &&
                        node.dataset.originalContent.match(this.PATTERN)
                    )
                )
            ) {
                if (!node.dataset.originalContent) {
                    node.dataset.originalContent = node.textContent;
                }

                node.textContent = this.replace(
                    node.dataset.originalContent || node.textContent,
                    data
                );
            }

        }
    },

    /**
     * Loops on the dataset of the dom node and replace the placeholders by data
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {void}
     */

    replaceDataset: {
        value: function (node, data) {

            var p;

            for (var prop in node.dataset) {
                p = prop.substring(0, 1).toUpperCase() + prop.substring(1);

                if (
                    node.dataset.hasOwnProperty(prop) &&
                    (
                        node.dataset[prop].match(this.PATTERN) ||
                        node.dataset['original' + p].match(this.PATTERN)
                    ) &&
                    prop.substring(0, 8) !== 'original' &&
                    prop.length !== 8
                ) {
                    if (!node.dataset['original' + p]) {
                        node.dataset['original' + p] = node.dataset[prop];
                    }

                    node.dataset[prop] = this.replace(
                        node.dataset['original' + p] || node.dataset[prop],
                        data
                    );
                }
            }

        }
    },

    /**
     * Look to replace placeholder in input value attribute
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {void}
     */

    replaceElementValue: {
        value: function (node, data) {

            if (
                node.value &&
                (
                    node.value.match(this.PATTERN) ||
                    node.dataset.originalValue.match(this.PATTERN)
                )
            ) {
                if (!node.dataset.originalValue) {
                    node.dataset.originalValue = node.value;
                }

                node.value = this.replace(
                    node.dataset.originalValue || node.value,
                    data
                );
            }

        }
    }

});
