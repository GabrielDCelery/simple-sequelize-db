'use strict';

const _ = require('lodash');
const DatabaseWrapper = require('./DatabaseWrapper');
const databaseInstances = {};

function createInstance (_config = {}, _instanceName = 'default') {
    if (!_.isNil(_.get(databaseInstances, _instanceName))) {
        throw new Error(`Database instance already exists -> ${_instanceName}`);
    }

    return _.set(databaseInstances, _instanceName, new DatabaseWrapper(_config));
}

function getInstance (_instanceName = 'default') {
    const _instance = _.get(databaseInstances, _instanceName, null);

    if (_instance === null) {
        throw new Error(`Tried to get a database instance before creating it -> ${_instanceName}`);
    }

    return _instance;
}

function deleteInstance (_instanceName = 'default') {
    if (!_.has(databaseInstances, _instanceName)) {
        throw new Error(`Tried to delete a non-existent database instance -> ${_instanceName}`);
    }

    _.set(databaseInstances, _instanceName, null);
}

module.exports = {
    createInstance: createInstance,
    getInstance: getInstance,
    deleteInstance: deleteInstance
};
