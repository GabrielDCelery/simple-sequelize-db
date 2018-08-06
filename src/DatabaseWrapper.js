'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

const VALID_MODEL_ASSOCIATION_TYPES = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];

class DatabaseWrapper {
    constructor (_dbConfig) {
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

    registerModel (_modelName, _modelDefinitionGenerator, _modelConfiguration) {
        if (this.models[_modelName]) {
            throw new Error(`Tried to register model twice -> ${_modelName}`);
        }

        if (!_.isFunction(_modelDefinitionGenerator)) {
            throw new Error(`Model definition generator for ${_modelName} must be a function!`);
        }

        this.models[_modelName] = this.sequelize.define(_modelName, _modelDefinitionGenerator(Sequelize), _modelConfiguration || {});

        return this.models[_modelName];
    }

    getModel (_modelName) {
        if (!this.models[_modelName]) {
            throw new Error(`Model does not exist -> ${_modelName}`);
        }

        return this.models[_modelName];
    }

    registerModelAssociation (_sourceModelNamePath, _associationType, _targetModelNamePath, _config) {
        if (VALID_MODEL_ASSOCIATION_TYPES.indexOf(_associationType) === -1) {
            throw new Error(`Invalid association type -> ${_associationType}!`);
        }

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
