'use strict';

const converterFactory = require('../../../lib/converter/converter');

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

describe('Directory to Semverish', () => {
  test('directoryToSemverishSeparator', () => {
    expect(converterFactory('semverist', 'directoryConverter')
      .then(ConverterClass => ConverterClass.getPathSeparatorRegEx('\\'))
      .then(obj => obj))
      .resolves.toEqual(/\\/g);
  });
});
