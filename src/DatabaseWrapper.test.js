'use strict';

const Sequelize = require('sequelize');
const DatabaseWrapper = require('./DatabaseWrapper');

jest.mock('sequelize');

beforeEach(() => {});

afterEach(() => {
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

    test('creates an instance with the provided configuration', () => {
        const _instance = new DatabaseWrapper({
            database: 'foo',
            username: 'bar',
            password: 'foobar',
            host: 'barfoo',
            dialect: 'postgres',
            pool: {
                max: 10,
                idle: 5000
            }
        });

        expect(_instance.synchronized).toEqual(false);
        expect(_instance.config).toEqual({
            database: 'foo',
            username: 'bar',
            password: 'foobar',
            host: 'barfoo',
            dialect: 'postgres',
            pool: {
                max: 10,
                min: 0,
                idle: 5000
            }
        });
        expect(_instance.models).toEqual({});
        expect(_instance.sequelize).toBeInstanceOf(Sequelize);
        expect(Sequelize).toHaveBeenCalledTimes(1);
        expect(Sequelize.mock.calls[0][0]).toEqual('foo');
        expect(Sequelize.mock.calls[0][1]).toEqual('bar');
        expect(Sequelize.mock.calls[0][2]).toEqual('foobar');
        expect(Sequelize.mock.calls[0][3]).toEqual({
            host: 'barfoo',
            dialect: 'postgres',
            operatorsAliases: _instance.OPERATORS_ALIASES,
            pool: {
                max: 10,
                min: 0,
                idle: 5000
            }
        });
    });
});

describe('registerModel (_modelNamePath, _modelDefinitionGenerator)', () => {
    test('validates the model name path', () => {
        const _instance = new DatabaseWrapper();

        _instance.registerModel('foo', () => {
            return 'bar';
        });
        /*
        expect(Validator.testRegExp).toHaveBeenCalledTimes(1);
        expect(Validator.testRegExp.mock.calls[0][0]).toEqual('VALID_MODEL_NAME_PATH');
        expect(Validator.testRegExp.mock.calls[0][1]).toEqual(_instance.VALID_MODEL_NAME_PATH);
        expect(Validator.testRegExp.mock.calls[0][2]).toEqual('foo');
        */
    });
});
