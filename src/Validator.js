'use strict';

class Validator {
    static _sendValidationResults (_nameOfTest, _value, _bValid) {
        if (_bValid) {
            return _value;
        }

        throw new Error(`Invalid ${_nameOfTest} -> ${_value}`);
    }

    static testRegExp (_nameOfTest, _regExp, _value) {
        return Validator._sendValidationResults(_nameOfTest, _value, _regExp.test(_value));
    }

    static isValidValue (_nameOfTest, _validValues, _value) {
        return Validator._sendValidationResults(_nameOfTest, _value, _validValues.indexOf(_value) !== -1);
    }
}

module.exports = Validator;
