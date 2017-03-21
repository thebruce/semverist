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
    rangeClass.setLowerBounds('0.1.1');
    rangeClass.setUpperBounds('< 1.0.0');
    return rangeClass.getUpperBounds();
  });
  t.deepEqual(
    t.context.data,
    '<1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('upperLowerBoundsDoesNotSatisfy', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('1.1.1');
    return rangeClass.setUpperBounds('< 1.0.0');
  }),
  'Lower bounds value must satisfy upperBounds range'
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

test('processedUpperBoundsOnlyUpper', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.0');
    rangeClass.setUpperBounds('< 1.0.0');
    return rangeClass.getProcessedUpperBound();
  });
  t.deepEqual(
    t.context.data,
    '<1.0.0',
    'Semverish get should return from semverish set.'
  );
});

test('processedUpperBoundsOnlyTerminal', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.0');
    rangeClass.setUpperBounds('<1.0.0');
    rangeClass.setTerminalBounds('0.9.9');
    return rangeClass.getProcessedUpperBound();
  });
  t.deepEqual(
    t.context.data,
    '<0.9.9',
    'Semverish get should return from semverish set.'
  );
});

test('processedUpperBoundsNoUpperBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    return rangeClass.getProcessedUpperBound();
  });
  t.deepEqual(
    t.context.data,
    null,
    'Semverish get should return from semverish set.'
  );
});

test('processedUpperBoundsBothBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.0');
    rangeClass.setUpperBounds('< 1.0.0');
    rangeClass.setTerminalBounds('0.0.9');
    return rangeClass.getProcessedUpperBound();
  });
  t.deepEqual(
    t.context.data,
    '<0.0.9',
    'Semverish get should return from semverish set.'
  );
});

test('satisfiesRangeWillSatisfy', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('0.0.9');
  });
  t.deepEqual(
    t.context.data,
    true,
    'Semverish get should return from semverish set.'
  );
});

test('satisfiesRangeCantGetMeNoSatisfaction', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.range = '< 1.0.0';
    return rangeClass.satisfiesRange('2.0.0');
  });
  t.deepEqual(
    t.context.data,
    false,
    'Semverish get should return from semverish set.'
  );
});

test('setRangeNoUpper', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const ranger = new RangeClass();
    ranger.init();
    ranger.setLowerBounds('1.0.0-alpha');
    ranger.setSemveristElement('entity');
    ranger.setSemverish('1.0.0-alpha.entity');
    ranger.setSemverishArray('1.0.0-alpha');
    ranger.setSemver('1.0.0-alpha.0');
    ranger.setOptions();
    ranger.setRange();
    return ranger.getRange();
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha <1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('setRangeNoUpperNoElement', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setLowerBounds('1.0.0-alpha');
    range.setSemverish('1.0.0-alpha');
    range.setSemverishArray('1.0.0-alpha');
    range.setSemver('1.0.0-alpha.0');
    range.setOptions();
    range.setRange();
    return range.getRange();
  });
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha <1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('SetRangeNoLowerBounds', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.init();
    range.setOptions();
    return range.setRange();
  }),
  'Can not create a range without a lower bounds value.'
  );
});
