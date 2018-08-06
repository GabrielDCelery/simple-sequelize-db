'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
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

const VALID_MODEL_NAME_PATH = new RegExp(/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/);
const VALID_ASSOCIATION_TYPES = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

class DatabaseWrapper {
    constructor (_dbConfig) {
        this.VALID_MODEL_NAME_PATH = VALID_MODEL_NAME_PATH;
        this.VALID_ASSOCIATION_TYPES = VALID_ASSOCIATION_TYPES;
        this.DEFAULT_DB_CONFIG = DEFAULT_DB_CONFIG;
        this.OPERATORS_ALIASES = OPERATORS_ALIASES;
        this.synchronized = false;
        this.models = {};
        this.config = _.defaultsDeep({}, _dbConfig, DEFAULT_DB_CONFIG);
        this.sequelize = new Sequelize(this.config.database, this.config.username, this.config.password, {
            host: this.config.host,
            dialect: this.config.dialect,
            operatorsAliases: OPERATORS_ALIASES,
            pool: this.config.pool
        });
    }

    registerModel (_modelNamePath, _modelDefinitionGenerator) {
        Validator.testRegExp('VALID_MODEL_NAME_PATH', this.VALID_MODEL_NAME_PATH, _modelNamePath);

        if (_.get(this.models, _modelNamePath) !== undefined) {
            throw new Error(`Tried to register model twice -> ${_modelNamePath}`);
        }

        if (!_.isFunction(_modelDefinitionGenerator)) {
            throw new Error(`Model definition generator for ${_modelNamePath} must be a function!`);
        }

        const _modelName = _.last(_.split(_modelNamePath, '.'));
        const _model = this.sequelize.define(_modelName, _modelDefinitionGenerator(Sequelize));

        _.set(this.models, _modelNamePath, _model);

        return _model;
    }

    getModel (_modelNamePath) {
        const _model = _.get(this.models, _modelNamePath);

        if (_model === null) {
            throw new Error(`Model does not exist -> ${_modelNamePath}`);
        }

        return _model;
    }

    registerModelAssociation (_sourceModelNamePath, _associationType, _targetModelNamePath, _config) {
        Validator.isValidValue('VALID_ASSOCIATION_TYPES', this.VALID_ASSOCIATION_TYPES, _associationType);

        const _sourceModel = this.getModel(_sourceModelNamePath);
        const _targetModel = this.getModel(_targetModelNamePath);

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
}

module.exports = DatabaseWrapper;
