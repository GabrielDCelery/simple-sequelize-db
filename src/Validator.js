'use strict';

const VALID_MODEL_NAME_PATH = new RegExp(/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/);
const VALID_MODEL_ASSOCIATION_TYPES = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

class Validator {
    static _returnValidated (_nameOfTest, _value, _bValid) {
        if (_bValid === true) {
            return _value;
        }

        throw new Error(`Invalid ${_nameOfTest} -> ${_value}`);
    }

    static testRegExp (_nameOfTest, _regExp, _value) {
        return Validator._returnValidated(_nameOfTest, _value, _regExp.test(_value));
    }

    static isValidValue (_nameOfTest, _validValues, _value) {
        return Validator._returnValidated(_nameOfTest, _value, _validValues.indexOf(_value) !== -1);
    }

    isValidModelNamePath () {

    }

    isValidModelAssociationType () {
        
    }
}

module.exports = Validator;
