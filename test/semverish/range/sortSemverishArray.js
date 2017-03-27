import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('sortSemverishArray', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.sortSemverishArray(
      [
        '2.0.0',
        '1.0.0'
      ]
    );
  });
  t.deepEqual(
    t.context.data,
    [
      '1.0.0',
      '2.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortSemverishArrayMixedSemverish', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
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
  });
  t.deepEqual(
    t.context.data,
    [
      '1',
      '1.1',
      '1.2',
      '1.2.1'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortSemverishArrayWayMixedSemverish', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
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
  });
  t.deepEqual(
    t.context.data,
    [
      '1',
      '1.1',
      '1.2',
      '1.2.1',
      '1.3',
      '1.5.1'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortSemverishArrayWayMixedSemverishWithEquivs', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
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
  });
  t.deepEqual(
    t.context.data,
    [
      '1',
      '1.0',
      '1.0.0',
      '1.1',
      '1.1.0',
      '1.2',
      '1.2.0',
      '1.3',
      '1.5.1'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('sortSemverishArrayNull', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortSemverishArray();
  }),
  'Can not sort a semverish Array that is not actually range.'
  );
});

test('sortSemverishArrayString', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.sortSemverishArray('not a range');
  }),
  'Can not sort a semverish Array that is not actually range.'
  );
});
