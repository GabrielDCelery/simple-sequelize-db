'use strict';

const Validator = require('./Validator');

beforeEach(() => {
    jest.spyOn(Validator, '_returnValidated');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('_returnValidated(_nameOfTest, _value, _bValid)', () => {
    test('returns the value if it was valid', () => {
        const _result = Validator._returnValidated('myTest', 'foo', true);

        expect(_result).toBe('foo');
    });

    test('throws an error if the value was not valid', () => {
        expect(() => {
            Validator._returnValidated('myTest', 'foo', false);
        }).toThrow('Invalid myTest -> foo');
    });
});

describe('testRegExp (_nameOfTest, _regExp, _value)', () => {
    test('returns the value if it passes the regula expression check', () => {
        const _result = Validator.testRegExp('myTest', new RegExp(/^[a-zA-Z]*$/), 'thisShouldPass');

        expect(_result).toBe('thisShouldPass');
        /*
        expect(Validator._returnValidated).toHaveBeenCalledTimes(1);
        expect(Validator._returnValidated.mock.calls[0][0]).toEqual('myTest');
        expect(Validator._returnValidated.mock.calls[0][1]).toEqual('thisShouldPass');
        expect(Validator._returnValidated.mock.calls[0][2]).toEqual(true);
        */
    });

    test('throws an error if the value does not pass the regular expression check', () => {
        /*
        expect(() => {
            Validator.testRegExp('myTest', new RegExp(/\n{2}/), 'thisShouldNotPass');
        }).toThrow('Invalid myTest -> thisShouldNotPass');
        expect(Validator._returnValidated).toHaveBeenCalledTimes(1);
        expect(Validator._returnValidated.mock.calls[0][0]).toEqual('myTest');
        expect(Validator._returnValidated.mock.calls[0][1]).toEqual('thisShouldNotPass');
        expect(Validator._returnValidated.mock.calls[0][2]).toEqual(false);
        */
    });
});

describe('isValidValue (_nameOfTest, _validValues, _value)', () => {
    test('returns the value if it is in the list of valid values', () => {
        /*
        const _result = Validator.isValidValue('myTest', [1, 2, 3, 'thisShouldPass'], 'thisShouldPass');

        expect(_result).toBe('thisShouldPass');
        expect(Validator._returnValidated).toHaveBeenCalledTimes(1);
        expect(Validator._returnValidated.mock.calls[0][0]).toEqual('myTest');
        expect(Validator._returnValidated.mock.calls[0][1]).toEqual('thisShouldPass');
        expect(Validator._returnValidated.mock.calls[0][2]).toEqual(true);
        */
    });

    test('throws an error if the value is not in the list of valid values', () => {
        /*
        expect(() => {
            Validator.isValidValue('myTest', [1, 2, 3], 'thisShouldNotPass');
        }).toThrow('Invalid myTest -> thisShouldNotPass');
        expect(Validator._returnValidated).toHaveBeenCalledTimes(1);
        expect(Validator._returnValidated).toHaveBeenCalledTimes(1);
        expect(Validator._returnValidated.mock.calls[0][0]).toEqual('myTest');
        expect(Validator._returnValidated.mock.calls[0][1]).toEqual('thisShouldNotPass');
        expect(Validator._returnValidated.mock.calls[0][2]).toEqual(false);
        */
    });
});
