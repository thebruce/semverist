import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('sortRangeArray', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '>1.0.0',
      '>2.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortRangeArrayPrerelease', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '>1.0.0-alpha',
      '>1.0.0-alpha.1',
      '>1.0.0',
      '>2.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortRangeArrayWithTwoSameLow', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '0.0.1',
      '>1.0.0 < 1.0.1',
      '>1.0.0 < 1.1.0',
      '>2.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortRangeArrayTwoSetsWithTwoSameLow', async (t) => {
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
  t.deepEqual(
    t.context.data,
    [
      '>0.0.1',
      '>1.0.0 < 1.0.1',
      '>1.0.0 < 1.1.0',
      '>1.1.0 < 1.1.3',
      '>1.1.0 < 1.2.0',
      '>2.0.0',
      '>3.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortRangeArrayNull', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray();
  }),
  'Can not sort a range Array that is not a range.'
  );
});

test('sortRangeArrayString', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortRangeArray('not a range');
  }),
  'Can not sort a range Array that is not a range.'
  );
});
