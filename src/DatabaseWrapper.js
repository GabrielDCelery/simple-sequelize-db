'use strict';

const _ = require('lodash');
const Sequelize = require('Sequelize');
const Op = Sequelize.Op;
const Validator = require('./Validator');

const OPERATORS_ALIASES = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

const DEFAULT_DB_CONFIG = {
    database: 'myDb',
    username: 'root',
    password: null,
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
};

const VALID_MODEL_NAME = new RegExp(/^[A-Za-z]+$/);
const VALID_NAMESPACE = new RegExp(/^[A-Za-z]+(\.[A-Za-z]+)*$/);
const VALID_ASSOCIATION_TYPES = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

class DatabaseWrapper {
    constructor (_dbConfig) {
        this.config = _.defaultsDeep({}, _dbConfig, DEFAULT_DB_CONFIG);
        this.sequelize = new Sequelize(this.config.database, this.config.username, this.config.password, {
            host: this.config.host,
            dialect: this.config.dialect,
            operatorsAliases: OPERATORS_ALIASES,
            pool: this.config.pool
        });
        this.models = {};
    }

    registerModel (_modelDefinition, _modelName, _nameSpace) {
        Validator.testRegExp('VALID_MODEL_NAME', VALID_MODEL_NAME, _modelName);

        if (_nameSpace !== undefined) {
            Validator.testRegExp('VALID_NAMESPACE', VALID_NAMESPACE, _nameSpace);
        }

        const _path = DatabaseWrapper._createModelNodePath(_modelName, _nameSpace);

        if (!_.isNil(_.get(this.models, _modelName))) {
            throw new Error(`Tried to register model twice -> ${_modelName}`);
        }

        if (!_.isFunction(_modelDefinition)) {
            throw new Error(`Model definition for ${_modelName} must be a function!`);
        }

        const _model = this.sequelize.define(_modelName, _modelDefinition(Sequelize));

        _.set(this.models, _path, _model);

        return _model;
    }

    getModel (_modelName, _nameSpace) {
        const _path = DatabaseWrapper._createModelNodePath(_modelName, _nameSpace);
        const _model = _.get(this.models, _path, null);

        if (_model === null) {
            throw new Error(`Model does not exist -> ${_modelName}`);
        }

        return _model;
    }

    registerModelAssociation (_associationType, _sourceModelName, _targetModelName, _config) {
        Validator.isValidValue('VALID_ASSOCIATION_TYPES', VALID_ASSOCIATION_TYPES, _associationType);

        const _sourceModel = this.getModel(_sourceModelName);
        const _targetModel = this.getModel(_targetModelName);

        return _sourceModel[_associationType](_targetModel, _config);
    }

    async syncDB (_bForce) {
        if (this.synchronized === true && _bForce !== true) {
            throw new Error('Tried to initialize database twice');
        }

        const _options = {};

        if (_bForce === true) {
            _options.force = true;
        }

        await this.sequelize.sync(_options);
        this.synchronized = true;

        return true;
    }

    static _createModelNodePath (_modelName, _nameSpace) {
        if (_nameSpace === undefined) {
            return _modelName;
        }

        return `${_nameSpace}.${_modelName}`;
    }
}

module.exports = DatabaseWrapper;
