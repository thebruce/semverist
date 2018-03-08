

const rangeFactory = require('../../../../lib/semverish/range');

let tmpMocks = [];
let ranger;

describe('Sort Semverish Array tests', () => {
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
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '2.0.0',
            '1.0.0',
          ]
        );
      })
      .then(obj => expect(obj).toEqual([
        '1.0.0',
        '2.0.0',
      ]));
  });

  test('sortSemverishArrayMixedSemverish', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '1',
            '1.2',
            '1.1',
            '1.2.1',
          ]
        );
      })
      .then(obj => expect(obj).toEqual([
        '1',
        '1.1',
        '1.2',
        '1.2.1',
      ]));
  });

  test('sortSemverishArrayWayMixedSemverish', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const rangeClass = new RangeClass();
        return rangeClass.sortSemverishArray(
          [
            '1',
            '1.2',
            '1.1',
            '1.5.1',
            '1.2.1',
            '1.3',
          ]
        );
      })
      .then(obj => expect(obj).toEqual([
        '1',
        '1.1',
        '1.2',
        '1.2.1',
        '1.3',
        '1.5.1',
      ]));
  });

  test('sortSemverishArrayWayMixedSemverishWithEquivs', () => {
    expect.assertions(1);
    return ranger
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
            '1',
          ]
        );
      })
      .then(obj => expect(obj).toMatchSnapshot());
  });

  test('sortSemverishArrayNull', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortSemverishArray();
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a semverish Array that is not actually range.');
      });
  });

  test('sortSemverishArrayString', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.sortSemverishArray('not a range');
      })
      .catch((e) => {
        expect(e.message).toEqual('Can not sort a semverish Array that is not actually range.');
      });
  });
});
