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

  test('sortSemverishArray', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '2.0.0',
            '1.0.0'
          ]
        );
      }))
    .resolves.toEqual([
      '1.0.0',
      '2.0.0'
    ]);
  });

  test('sortSemverishArrayMixedSemverish', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '1',
            '1.2',
            '1.1',
            '1.2.1'
          ]
        );
      })
    ).resolves.toEqual([
      '1',
      '1.1',
      '1.2',
      '1.2.1'
    ]);
  });

  test('sortSemverishArrayWayMixedSemverish', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '1',
            '1.2',
            '1.1',
            '1.5.1',
            '1.2.1',
            '1.3'
          ]
        );
      })
    ).resolves.toEqual([
      '1',
      '1.1',
      '1.2',
      '1.2.1',
      '1.3',
      '1.5.1'
    ]);
  });

  test('sortSemverishArrayWayMixedSemverishWithEquivs', () => {
    expect(ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '1.0.0',
            '1.0',
            '1.1',
            '1.2',
            '1.1.0',
            '1.2.0',
            '1.3',
            '1.5.1',
            '1'
          ]
        );
      })
    ).resolves.toEqual([
      '1',
      '1.0',
      '1.0.0',
      '1.1',
      '1.1.0',
      '1.2',
      '1.2.0',
      '1.3',
      '1.5.1'
    ]);
  });

  test('sortSemverishArrayNull', () => {
    rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortSemverishArray();
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a semverish Array that is not actually range.');
      });
  });

  test('sortSemverishArrayString', () => {
    rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortSemverishArray('not a range');
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a semverish Array that is not actually range.');
      });
    })
});
