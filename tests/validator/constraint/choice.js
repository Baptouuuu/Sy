/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Choice.js
 */

describe('Choice constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Choice();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.ChoiceValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Choice();

        expect(c.getMessage()).toEqual('The value you selected is not a valid choice');
        expect(c.getMultipleMessage()).toEqual('One or more of the given values is invalid');
        expect(c.getMinMessage()).toEqual('You must select more choices');
        expect(c.getMaxMessage()).toEqual('You have selected too many choices');

        c = new Sy.Validator.Constraint.Choice({
            message: 'foo',
            multipleMessage: 'bar',
            minMessage: 'min',
            maxMessage: 'max'
        });

        expect(c.getMessage()).toEqual('foo');
        expect(c.getMultipleMessage()).toEqual('bar');
        expect(c.getMinMessage()).toEqual('min');
        expect(c.getMaxMessage()).toEqual('max');
    });

    it('should return the choices', function () {
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3]
        });

        expect(c.getChoices() instanceof Array).toBe(true);
        expect(c.getChoices().length).toEqual(3);
        expect(c.getChoices()).toEqual([1, 2, 3]);
    });

    it('should say if multiple choices accepted', function () {
        var c = new Sy.Validator.Constraint.Choice({multiple: true});

        expect(c.isMultiple()).toBe(true);
    });

    it('should say if it has a minimum or not', function () {
        var c = new Sy.Validator.Constraint.Choice({min: 1});

        expect(c.hasMin()).toBe(true);

        c = new Sy.Validator.Constraint.Choice();

        expect(c.hasMin()).toBe(false);
    });

    it('should say if it has a maximum or not', function () {
        var c = new Sy.Validator.Constraint.Choice({max: 1});

        expect(c.hasMax()).toBe(true);

        c = new Sy.Validator.Constraint.Choice();

        expect(c.hasMax()).toBe(false);
    });

    it('should return the min', function () {
        var c = new Sy.Validator.Constraint.Choice({min: 1});

        expect(c.getMin()).toEqual(1);
    });

    it('should return the max', function () {
        var c = new Sy.Validator.Constraint.Choice({max: 1});

        expect(c.getMax()).toEqual(1);
    });

    it('should say if it has a callback or not', function () {
        var c = new Sy.Validator.Constraint.Choice({callback: 'foo'});

        expect(c.hasCallback()).toBe(true);

        c = new Sy.Validator.Constraint.Choice();

        expect(c.hasCallback()).toBe(false);
    });

});
