const rangeFactory = require('../../../lib/semverish/range');

test('sortRangeArray', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray(
      [
        '>2.0.0',
        '>1.0.0'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '>1.0.0',
    '>2.0.0'
  ]);
});

test('sortRangeArrayPrerelease', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray(
      [
        '>2.0.0',
        '>1.0.0',
        '>1.0.0-alpha',
        '>1.0.0-alpha.1'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '>1.0.0-alpha',
    '>1.0.0-alpha.1',
    '>1.0.0',
    '>2.0.0'
  ]);
});

test('sortRangeArrayWithTwoSameLow', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray(
      [
        '>2.0.0',
        '>1.0.0 < 1.0.1',
        '>1.0.0 < 1.1.0',
        '0.0.1'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '0.0.1',
    '>1.0.0 < 1.0.1',
    '>1.0.0 < 1.1.0',
    '>2.0.0'
  ]);
});

test('sortRangeArrayTwoSetsWithTwoSameLow', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortRangeArray(
      [
        '>2.0.0',
        '>1.0.0 < 1.0.1',
        '>1.0.0 < 1.1.0',
        '>0.0.1',
        '>1.1.0 < 1.1.3',
        '>3.0',
        '>1.1.0 < 1.2.0'
      ]
    );
  });
  expect(t.context.data).toEqual([
    '>0.0.1',
    '>1.0.0 < 1.0.1',
    '>1.0.0 < 1.1.0',
    '>1.1.0 < 1.1.3',
    '>1.1.0 < 1.2.0',
    '>2.0.0',
    '>3.0'
  ]);
});

test('sortRangeArrayNull', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray();
  })).toThrowError('Can not sort a range Array that is not a range.');
});

test('sortRangeArrayString', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  })).toThrowError('Can not sort a range Array that is not a range.');
});
