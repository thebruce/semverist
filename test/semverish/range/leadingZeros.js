import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('converLeadingZerosToLazySemver3Zero', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.convertLeadingZeroSemverToLazySemveristRange('0.0.0', 3);
  });

  t.deepEqual(
    t.context.data,
    '>=0.0.0 <1.0.0'
    );
});

test('converLeadingZerosToLazySemver2Zero', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.convertLeadingZeroSemverToLazySemveristRange('0.0.1', 2);
  });

  t.deepEqual(
    t.context.data,
    '>=0.0.1 <1.0.0'
    );
});

test('converLeadingZerosToLazySemver1Zero', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.convertLeadingZeroSemverToLazySemveristRange('0.1.1', 1);
  });
  t.deepEqual(
    t.context.data,
    '>=0.1.1 <1.0.0'
    );
});

test('converLeadingZerosToLazySemverSemverishValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.convertLeadingZeroSemverToLazySemveristRange('0');
  });
  t.deepEqual(
    t.context.data,
    '>=0.0.0 <1.0.0'
    );
});

test('semverLeadinZeroCount', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.1.1');
    range.setSemverishArray('0.1.1');
    return range.semverLeadingZeroCount('0.1.1');
  });
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountOneValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.0');
    range.setSemverishArray('0');
    return range.semverLeadingZeroCount('0.0.0');
  });
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountOneValueNonZero', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('1.0.0');
    range.setSemverishArray('1');
    return range.semverLeadingZeroCount('1.0.0');
  });
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountTwoValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.0');
    range.setSemverishArray('0.0');
    return range.semverLeadingZeroCount('0.0.0');
  });
  t.deepEqual(
    t.context.data,
    2,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValue', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.0');
    range.setSemverishArray('0.0.0');
    return range.semverLeadingZeroCount('0.0.0');
  });
  t.deepEqual(
    t.context.data,
    3,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueTwoLeading', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.1');
    range.setSemverishArray('0.0.1');
    return range.semverLeadingZeroCount('0.0.1');
  });
  t.deepEqual(
    t.context.data,
    2,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueOneLeading', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.1.1');
    range.setSemverishArray('0.1.1');
    return range.semverLeadingZeroCount('0.1.1');
  });
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueNoZeroes', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('1.0.0');
    range.setSemverishArray('1.0.0');
    return range.semverLeadingZeroCount('1.0.0');
  });
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCounTwoValuesLeadingZeroProperty', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.1.0');
    range.setSemverishArray('0.1.entity');
    return range.semverLeadingZeroCount('0.1.0');
  });
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadingZeroCountNoParsed', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    return range.semverLeadingZeroCount('1.0.0');
  }),
  'There must be a parsed semver to analyze.');
});
