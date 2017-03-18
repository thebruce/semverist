import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('lowerBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('1.0.0');
    return rangeClass.getLowerBounds();
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('upperBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setUpperBounds('> 1.0.0');
    return rangeClass.getUpperBounds();
  });
  t.deepEqual(
    t.context.data,
    '>1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('UpperBoundsInvalidRange', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setUpperBounds('> 1.R');
  }),
  'The passed range is not a valid semver range.');
});

test('terminalBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setTerminalBounds('> 1.0.0');
    return rangeClass.getTerminalBounds();
  });
  t.deepEqual(
    t.context.data,
    '>1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('terminalBoundsInvalidRange', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setTerminalBounds('> 1.R');
  }),
  'The passed range is not a valid semver range.');
});

test('semverishPlugin', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemverish('1.0');
    return rangeClass.getSemverish();
  });
  t.deepEqual(
    t.context.data,
    '1.0',
    'Semverish get should return from semverish set.'
  );
});

test('semveristElementPlugin', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setSemveristElement('entity');
    return rangeClass.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
  );
});

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
