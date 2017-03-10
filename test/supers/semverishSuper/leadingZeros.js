import test from 'ava';

const SemverishSuper = require('../../../lib/supers/semverishSuper');

test('converLeadingZerosToLazySemver3Zero', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.convertLeadingZeroSemverToLazySemveristRange('0.0.0', 3);
  t.deepEqual(
    t.context.data,
    '>=0.0.0 <1.0.0'
    );
});

test('converLeadingZerosToLazySemver2Zero', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.convertLeadingZeroSemverToLazySemveristRange('0.0.1', 2);
  t.deepEqual(
    t.context.data,
    '>=0.0.1 <1.0.0'
    );
});

test('converLeadingZerosToLazySemver1Zero', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.convertLeadingZeroSemverToLazySemveristRange('0.1.1', 1);
  t.deepEqual(
    t.context.data,
    '>=0.1.1 <1.0.0'
    );
});

test('converLeadingZerosToLazySemverSemverishValue', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.convertLeadingZeroSemverToLazySemveristRange('0');
  t.deepEqual(
    t.context.data,
    '>=0.0.0 <1.0.0'
    );
});

test('semverLeadinZeroCount', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.1.1');
  semverishSuper.setSemverishArray('0.1.1');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.1.1');
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountOneValue', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.0');
  semverishSuper.setSemverishArray('0');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.0.0');
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountOneValueNonZero', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1');
  t.context.data = semverishSuper.semverLeadingZeroCount('1.0.0');
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountTwoValue', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.0');
  semverishSuper.setSemverishArray('0.0');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.0.0');
  t.deepEqual(
    t.context.data,
    2,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValue', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.0');
  semverishSuper.setSemverishArray('0.0.0');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.0.0');
  t.deepEqual(
    t.context.data,
    3,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueTwoLeading', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.1');
  semverishSuper.setSemverishArray('0.0.1');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.0.1');
  t.deepEqual(
    t.context.data,
    2,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueOneLeading', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.1.1');
  semverishSuper.setSemverishArray('0.1.1');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.1.1');
  t.deepEqual(
    t.context.data,
    1,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCountThreeValueNoZeroes', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1.0.0');
  t.context.data = semverishSuper.semverLeadingZeroCount('1.0.0');
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadinZeroCounTwoValuesLeadingZeroProperty', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.1.0');
  semverishSuper.setSemverishArray('0.1.entity');
  t.context.data = semverishSuper.semverLeadingZeroCount('0.1.0');
  t.deepEqual(
    t.context.data,
    0,
    'Tilde values should pass back the correct range'
  );
});

test('semverLeadingZeroCountNoParsed', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    t.context.data = semverishSuper.semverLeadingZeroCount('1.0.0');
  },
  'There must be a parsed semver to analyze.');
});
