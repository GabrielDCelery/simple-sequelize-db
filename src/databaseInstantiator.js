'use strict';

const DatabaseWrapper = require('./DatabaseWrapper');

let singleton = null;

class DatabaseInstantiator {
    constructor () {
        if (singleton) {
            return singleton;
        }

        this.instances = {};

        singleton = this;

        return this;
    }

    create (_config = {}, _instanceName = 'default') {
        if (this.instances[_instanceName]) {
            throw new Error(`Database instance already exists -> ${_instanceName}`);
        }

        this.instances[_instanceName] = new DatabaseWrapper(_config);

        return this.instances[_instanceName];
    }

    get (_instanceName = 'default') {
        if (!this.instances[_instanceName]) {
            throw new Error(`Tried to get a database instance before creating it -> ${_instanceName}`);
        }

        return this.instances[_instanceName];
    }

    remove (_instanceName = 'default') {
        if (!this.instances[_instanceName]) {
            throw new Error(`Tried to delete a non-existent database instance -> ${_instanceName}`);
        }

        this.instances[_instanceName] = null;
    }
}

module.exports = new DatabaseInstantiator();
