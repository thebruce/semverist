'use strict';

const configLoader = require('../../lib/configLoader');
const nestedConfig = require('../helpers/nestedConfig.json');

let tmpMocks = [];

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Config Loader tests', () => {
  test('init with overrides lazy Semverist', () => {
    const config = configLoader('useLazySemverist', nestedConfig.semverist);
    expect(config.semveristBehaviors.inheritence).toEqual('lazySemverist');
  });

  test('init with overrides semver Implied', () => {
    const config = configLoader('useSemverImplied', nestedConfig.semverist);
    expect(config.semveristBehaviors.inheritence).toEqual('semverImplied');
  });

  test('Config name space does not exist', () => {
    expect(() => {
      configLoader('notAKey', nestedConfig.semverist);
    }).toThrowError('Name space does not exist in passed configs.');
  });

  test('init with overrides no name space', () => {
    const config = configLoader(null, nestedConfig.semverist);
    expect(config.semveristBehaviors.inheritence).toEqual('semverImplied');
  });

  test('init with defaults', () => {
    const config = configLoader();
    expect(config.semveristBehaviors.inheritence).toEqual('semverImplied');
  });
});
