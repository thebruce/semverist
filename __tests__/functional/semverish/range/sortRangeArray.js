const rangeFactory = require('../../../../lib/semverish/range');

let tmpMocks = [];
let ranger;

describe('Sort range array tests', () => {
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
  test('sortRangeArray', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        return rangeClass.sortRangeArray(['>2.0.0', '>1.0.0']);
      })
      .then(obj => expect(obj).toEqual(['>1.0.0', '>2.0.0']));
  });

  test('sortRangeArrayPrerelease', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        return rangeClass.sortRangeArray([
          '>2.0.0',
          '>1.0.0',
          '>1.0.0-alpha',
          '>1.0.0-alpha.1',
        ]);
      })
      .then(obj =>
        expect(obj).toEqual([
          '>1.0.0-alpha',
          '>1.0.0-alpha.1',
          '>1.0.0',
          '>2.0.0',
        ])
      );
  });

  test('sortRangeArrayWithTwoSameLow', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        return rangeClass.sortRangeArray([
          '>2.0.0',
          '>1.0.0 < 1.0.1',
          '>1.0.0 < 1.1.0',
          '0.0.1',
        ]);
      })
      .then(obj =>
        expect(obj).toEqual([
          '0.0.1',
          '>1.0.0 < 1.0.1',
          '>1.0.0 < 1.1.0',
          '>2.0.0',
        ])
      );
  });

  test('sortRangeArrayTwoSetsWithTwoSameLow', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        return rangeClass.sortRangeArray([
          '>2.0.0',
          '>1.0.0 < 1.0.1',
          '>1.0.0 < 1.1.0',
          '>0.0.1',
          '>1.1.0 < 1.1.3',
          '>3.0',
          '>1.1.0 < 1.2.0',
        ]);
      })
      .then(obj =>
        expect(obj).toEqual([
          '>0.0.1',
          '>1.0.0 < 1.0.1',
          '>1.0.0 < 1.1.0',
          '>1.1.0 < 1.1.3',
          '>1.1.0 < 1.2.0',
          '>2.0.0',
          '>3.0',
        ])
      );
  });

  test('sortRangeArrayNull', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then(RangeClass => {
        const range = new RangeClass();
        return range.sortRangeArray();
      })
      .catch(e => {
        expect(e.message).toEqual(
          'Can not sort a range Array that is not a range.'
        );
      });
  });

  test('sortRangeArrayString', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then(RangeClass => {
        const range = new RangeClass();
        return range.sortRangeArray('not a range');
      })
      .catch(e => {
        expect(e.message).toEqual(
          'Can not sort a range Array that is not a range.'
        );
      });
  });
});
