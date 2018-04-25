'use strict';

const Sequelize = require('sequelize');
const DatabaseWrapper = require('./DatabaseWrapper');

jest.mock('sequelize');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('constructor(_config)', () => {
    test('creates a default instance if there is no defined configuration', () => {
        const _instance = new DatabaseWrapper();

        expect(_instance.synchronized).toEqual(false);
        expect(_instance.config).toEqual(_instance.DEFAULT_DB_CONFIG);
        expect(_instance.models).toEqual({});
        expect(_instance.sequelize).toBeInstanceOf(Sequelize);
        expect(Sequelize).toHaveBeenCalledTimes(1);
        expect(Sequelize.mock.calls[0][0]).toEqual(_instance.config.database);
        expect(Sequelize.mock.calls[0][1]).toEqual(_instance.config.username);
        expect(Sequelize.mock.calls[0][2]).toEqual(_instance.config.password);
        expect(Sequelize.mock.calls[0][3]).toEqual({
            host: _instance.config.host,
            dialect: _instance.config.dialect,
            operatorsAliases: _instance.OPERATORS_ALIASES,
            pool: _instance.config.pool
        });
    });
});
