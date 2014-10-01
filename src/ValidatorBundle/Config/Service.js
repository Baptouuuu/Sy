namespace('Sy.ValidatorBundle.Config');

/**
 * Register validator services
 *
 * @package Sy
 * @subpackage ValidatorBundle
 * @class
 */

Sy.ValidatorBundle.Config.Service = function () {};
Sy.ValidatorBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                validator: '@sy::core::validator',
                'sy::core::validator': {
                    constructor: 'Sy.Validator.Core',
                    calls: [
                        ['setRulesRegistry', ['@sy::core::registry']],
                        ['setContextFactory', ['@sy::core::validator::executioncontextfactory']],
                        ['setConstraintFactory', ['@sy::core::validator::constraintfactory']]
                    ]
                },
                'sy::core::validator::executioncontextfactory': {
                    constructor: 'Sy.Validator.ExecutionContextFactory',
                    calls: [
                        ['setConstraintValidatorFactory', ['@sy::core::validator::constraintvalidatorfactory']]
                    ],
                    private: true
                },
                'sy::core::validator::constraintvalidatorfactory': {
                    constructor: 'Sy.Validator.ConstraintValidatorFactory',
                    private: true
                },
                'sy::core::validator::constraintfactory': {
                    constructor: 'Sy.Validator.ConstraintFactory',
                    private: true
                }
            });
        }
    }
});