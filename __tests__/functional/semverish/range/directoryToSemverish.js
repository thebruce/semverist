'use strict';

const converterFactory = require('../../../../lib/converter/converter');

let tmpMocks = [];

describe('Directory to Semverish', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('directoryToSemverishSeparator', () => {
    expect.assertions(1);
    return converterFactory('semverist', 'directoryConverter')
      .then(ConverterClass => ConverterClass.getPathSeparatorRegEx('\\'))
      .then(obj => expect(obj).toEqual(/\\/g));
  });
});
