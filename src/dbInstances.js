'use strict';

const _ = require('lodash');
const DatabaseWrapper = require('./DatabaseWrapper');
const dbInstances = {};

function createInstance (_instanceName = 'default', _config = {}) {
    if (!_.isNil(_.get(dbInstances, _instanceName))) {
        throw new Error(`Database instance already exists -> ${_instanceName}`);
    }

    return _.set(dbInstances, _instanceName, new DatabaseWrapper(_config));
}

function getInstance (_instanceName = 'default') {
    const _instance = _.get(dbInstances, _instanceName, null);

    if (_instance === null) {
        throw new Error(
            `Tried to get a database instance before creating it -> ${_instanceName}`
        );
    }

    return _instance;
}

module.exports = {
    createInstance: createInstance,
    getInstance: getInstance
};
