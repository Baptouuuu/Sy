namespace('Sy.Form');

/**
 * Default implementation of `FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormInterface}
 */

Sy.Form.Form = function () {
    this.elements = [];
    this.name = null;
    this.config = null;
    this.validator = null;
    this.form = null;
    this.object = null;
};
Sy.Form.Form.prototype = Object.create(Sy.Form.FormInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.elements.push(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * @inheritDoc
     */

    setOptions: {
        value: function (config) {
            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            this.config = config;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    isValid: {
        value: function () {

            if (this.validator) {
                return !!this.validator.validate(
                    this.object,
                    this.config.get('validationGroups')
                );
            } else if (this.form) {
                return this.form.checkValidity();
            }

            return true;

        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * @inheritDoc
     */

    handle: {
        value: function (form) {
            if (form) {
                this.form = form;
            } else if (!this.form && this.getName()) {
                this.form = document.querySelector('form[id=' + this.getName() + ']');
            }

            if (!this.form) {
                throw new ReferenceError('Form element not found');
            }

            if (!this.object) {
                return;
            }

            var refl = new ReflectionObject(this.object),
                els = this.elements,
                setter,
                value;

            for (var i = 0, l = els.length; i < l; i++) {
                if (this.form.elements[els[i]] !== undefined) {
                    setter = 'set' + els[i].charAt(0).toUpperCase() + els[i].substr(1);
                    value = this.form.elements[els[i]].value;

                    if (refl.hasMethod(setter)) {
                        refl.getMethod(setter).call(value);
                    } else if (refl.hasMethod('set')) {
                        refl.getMethod('set').call(els[i], value);
                    } else {
                        this.object[els[i]] = value;
                    }
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    }

});
