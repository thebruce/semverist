'use strict';

const rangeFactory = require('../../../lib/semverish/range');
let tmpMocks = [];
let ranger;

describe('Range tests', () => {
  beforeEach(() => {
    ranger = rangeFactory('semverist', 'range');
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('terminalBounds', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('0.0.9');
        return rangeClass.getTerminalBounds();
      })
    ).resolves.toEqual('0.0.9');
  });

  test('terminalBoundsRange', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('<0.0.9');
        return rangeClass.getTerminalBounds();
      })
    ).resolves.toEqual('<0.0.9');
  });


  test('terminalBoundsInvalidRange', () => {
    ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('1.R');
      })
      .catch((e) => {
        expect(e.message).toEqual('The passed range is not a valid semver range.');
      });
  });
});