import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('setChildRangeArray', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setChildRangeArray('>1.0.0');
    return rangeClass.getChildRangeArray();
  });
  t.deepEqual(
    t.context.data,
    ['>1.0.0'],
    'Semverish get should return from semverish set.'
  );
});

test('setChildRangeArrayNoValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setChildRangeArray();
    return rangeClass.getChildRangeArray();
  });
  t.deepEqual(
    t.context.data,
    [],
    'Semverish get should return from semverish set.'
  );
});

test('setChildRangeArrayRangeValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setChildRangeArray(
      [
        '>1.0.0',
        '>2.0.0'
      ]
    );
    return rangeClass.getChildRangeArray();
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


test('addChildRangeArrayRangeValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setChildRangeArray(
      [
        '>1.0.0',
        '>2.0.0'
      ]
    );
    rangeClass.addToChildRangeArray('>1.1.0');
    return rangeClass.getChildRangeArray();
  });
  t.deepEqual(
    t.context.data,
    [
      '>1.0.0',
      '>1.1.0',
      '>2.0.0'
    ],
    'Semverish get should return from semverish set.'
  );
});

test('addChildRangeNotRange', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setChildRangeArray(
      [
        '>1.0.0',
        '>2.0.0'
      ]
    );
    return rangeClass.addToChildRangeArray('not a range');
  }),
  'The passed range is not a valid semver range.'
  );
});
