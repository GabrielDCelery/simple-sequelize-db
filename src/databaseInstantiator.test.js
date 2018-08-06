'use strict';

const DatabaseWrapper = require('./DatabaseWrapper');
const databaseInstantiator = require('./databaseInstantiator');

jest.mock('./DatabaseWrapper');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createInstance(_config, _instanceName)', () => {
    test('creates a default database instance', () => {
        databaseInstantiator.create();

        expect(DatabaseWrapper).toHaveBeenCalledTimes(1);
        expect(DatabaseWrapper.mock.calls[0][0]).toEqual({});
    });

    test('creates a named database instance', () => {
        databaseInstantiator.create('myCustomConfig', 'myDbInstance');

        expect(DatabaseWrapper).toHaveBeenCalledTimes(1);
        expect(DatabaseWrapper.mock.calls[0][0]).toEqual('myCustomConfig');
    });

    test('throws an error if instance already exists', () => {
        expect(() => {
            databaseInstantiator.create({}, 'myDbInstance');
        }).toThrow('Database instance already exists -> myDbInstance');
    });
});

describe('getInstance(_instanceName)', () => {
    test('gets a database instance', () => {
        const _instance = databaseInstantiator.get('myDbInstance');

        expect(_instance).toBeInstanceOf(DatabaseWrapper);
    });

    test('throws an error if database instance does not exist', () => {
        expect(() => {
            databaseInstantiator.get('nonExistentDbInstance');
        }).toThrow('Tried to get a database instance before creating it -> nonExistentDbInstance');
    });
});

describe('deleteInstance(_instanceName)', () => {
    test('deletes a default database instance', () => {
        databaseInstantiator.remove();
    });

    test('deletes a named database instance', () => {
        databaseInstantiator.remove('myDbInstance');
    });

    test('throws an error if database instance does not exist', () => {
        expect(() => {
            databaseInstantiator.remove('nonExistentDbInstance');
        }).toThrow('Tried to delete a non-existent database instance -> nonExistentDbInstance');
    });
});
