'use strict';

const _ = require('lodash');
const DatabaseWrapper = require('./DatabaseWrapper');
const dbInstances = require('./dbInstances');

jest.mock('./DatabaseWrapper');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createInstance(_instanceName, _config)', () => {
    test('creates a default database instance', () => {
        jest.spyOn(_, 'set');

        dbInstances.createInstance();

        expect(_.set).toHaveBeenCalledTimes(1);
        expect(_.set.mock.calls[0][1]).toBe('default');
        expect(_.set.mock.calls[0][2]).toBeInstanceOf(DatabaseWrapper);
        expect(DatabaseWrapper).toHaveBeenCalledTimes(1);
        expect(DatabaseWrapper.mock.calls[0][0]).toEqual({});
    });

    test('creates a named database instance', () => {
        jest.spyOn(_, 'set');

        dbInstances.createInstance('myDbInstance', 'myCustomConfig');

        expect(_.set).toHaveBeenCalledTimes(1);
        expect(_.set.mock.calls[0][1]).toBe('myDbInstance');
        expect(_.set.mock.calls[0][2]).toBeInstanceOf(DatabaseWrapper);
        expect(DatabaseWrapper).toHaveBeenCalledTimes(1);
        expect(DatabaseWrapper.mock.calls[0][0]).toEqual('myCustomConfig');
    });

    test('throws an error if instance already exists', () => {
        jest.spyOn(_, 'get');

        expect(() => {
            dbInstances.createInstance('myDbInstance');
        }).toThrow('Database instance already exists -> myDbInstance');

        expect(_.get).toHaveBeenCalledTimes(1);
        expect(_.get.mock.calls[0][1]).toBe('myDbInstance');
    });
});

describe('getInstance(_instanceName)', () => {
    test('gets a database instance', () => {
        jest.spyOn(_, 'get');

        const _instance = dbInstances.getInstance('myDbInstance');

        expect(_instance).toBeInstanceOf(DatabaseWrapper);
        expect(_.get).toHaveBeenCalledTimes(1);
        expect(_.get.mock.calls[0][1]).toBe('myDbInstance');
    });

    test('throws an error if database instance does not exist', () => {
        jest.spyOn(_, 'get');

        expect(() => {
            dbInstances.getInstance('nonExistentDbInstance');
        }).toThrow(
            'Tried to get a database instance before creating it -> nonExistentDbInstance'
        );
        expect(_.get).toHaveBeenCalledTimes(1);
        expect(_.get.mock.calls[0][1]).toBe('nonExistentDbInstance');
    });
});
