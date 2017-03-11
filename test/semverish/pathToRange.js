import test from 'ava';

const SemverishSuper = require('../../lib/semverish/semverish');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: 'semverImplied',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: false
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'lastIn',
    preReleasePattern: /\d-[a-zA-Z]*/g
  },
  groups: {},
  prereleaseOrdering: {}
};

test('pathToRangePathZeroLength', (t) => {
  const semverishSuper = new SemverishSuper();
  t.throws(() => {
    semverishSuper.pathToRange('');
  },
  'The path must have atleast a single major component.');
});

test('pathToRangeOptionsNoInheritence', (t) => {
  const semverishSuper = new SemverishSuper();
  t.throws(() => {
    semverishSuper.pathToRange('1', {});
  },
  'The options object must have inheritence defined even if its value is null.');
});

test('pathToRangeOptionsBadInheritence', (t) => {
  const semverishSuper = new SemverishSuper();
  t.throws(() => {
    semverishSuper.pathToRange('1', {inheritence: 'bad'});
  },
  String.prototype.concat('The options inheritence attribute must one of the following values:',
  ' semverImplied, undefined, or lazySemverist'
  ));
});

test('pathToRangeInheritenceNull', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange('1.0.0', {inheritence: null});
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Null inheritence value means that we have a direct pass through.'
  );
});

test('semveristObjectTestsMaxLevel3', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semveristObjectTestsMaxLevel4', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0-alpha.0+124', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '1.0.0-alpha.0+124',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semveristObjectTestsPartial1', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Semverist Objects with 1 object should be set to ~x'
  );
});

test('semveristObjectTestsPartial2', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Semverist Objects with 2 objects should be set to ~x.y'
  );
});

test('semveristObjectTestsAlpha', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0-alpha.1', {attribute: 'semveristObject', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha.1 <1.1.0',
    'Semverist Objects with 3 objects and prerelease should be set to ~x.y.z-[0-9A-Za-z]'
  );
});

test('semverImpliedTestsMaxLevel3', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0', {attribute: 'attribute', inheritence: 'semverImplied'}
  );
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semverImpliedTestsMaxLevel4', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0-alpha.0+124', {attribute: 'attribute', inheritence: 'semverImplied'}
  );
  t.deepEqual(
    t.context.data,
    '1.0.0-alpha.0+124',
    'Semverist Objects at max level are a pass through.'
  );
});

test('semverImpliedTestsPartial1', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1', {attribute: 'attribute', inheritence: 'semverImplied'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Semverist Objects with 1 object should be set to ~x'
  );
});

test('semverImpliedTestsPartial2', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0', {attribute: 'attribute', inheritence: 'semverImplied'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Semverist Objects with 2 objects should be set to ~x.y'
  );
});

test('semverImpliedTestsAlpha', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.pathToRange(
    '1.0.0-alpha.1', {attribute: 'attribute', inheritence: 'semverImplied'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0-alpha.1 <1.1.0',
    'Semverist Objects with 3 objects and prerelease should be set to ~x.y.z-[0-9A-Za-z]'
  );
});

test('toTildeRange', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.toTildeRange('1.0');
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <1.1.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeading0FullSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('0.1.0-alpha.1');
  semverishSuper.setSemverishArray('0.1.0-alpha.1');
  semverishSuper.setSemveristConfigItem(
    'semveristBehaviors.lazySemverist.preReleaseForwards',
    true
  );
  t.context.data = semverishSuper.pathToRange(
    '0.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=0.1.0-alpha.1 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroFullSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.1.0-alpha.1');
  semverishSuper.setSemverishArray('1.1.0-alpha.1');
  semverishSuper.setSemveristConfigItem(
    'semveristBehaviors.lazySemverist.preReleaseForwards',
    true
  );
  t.context.data = semverishSuper.pathToRange(
    '1.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha.1 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingZeroPartialSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('0.1.0-alpha');
  semverishSuper.setSemverishArray('0.1.0-alpha');
  semverishSuper.setSemveristConfigItem(
    'semveristBehaviors.lazySemverist.preReleaseForwards',
    true
  );
  t.context.data = semverishSuper.pathToRange(
    '0.1.0-alpha', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=0.1.0-alpha.0 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseWithForwardingLeadingNonZeroPartialSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.1.0-alpha');
  semverishSuper.setSemverishArray('1.1.0-alpha');
  semverishSuper.setSemveristConfigItem(
    'semveristBehaviors.lazySemverist.preReleaseForwards',
    true
  );
  t.context.data = semverishSuper.pathToRange(
    '1.1.0-alpha', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('pathHasPrereleaseNoForwarding', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.1.0-alpha.1');
  semverishSuper.setSemverishArray('1.1.0-alpha.1');
  t.context.data = semverishSuper.pathToRange(
    '1.1.0-alpha.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.1.0-alpha.1 <1.2.0',
    'Tilde values should pass back the correct range'
  );
});


test('lazySemveristNoPrerelease3Long', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.1.0');
  semverishSuper.setSemverishArray('1.1.0');
  t.context.data = semverishSuper.pathToRange(
    '1.1.0', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.1.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease3LongLeadingZero', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('0.1.0');
  semverishSuper.setSemverishArray('0.1.0');
  t.context.data = semverishSuper.pathToRange(
    '0.1.0', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=0.1.0 <1.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease2Long', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.1.0');
  semverishSuper.setSemverishArray('1.1');
  t.context.data = semverishSuper.pathToRange(
    '1.1', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.1.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});

test('lazySemveristNoPrerelease1Long', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristConfig(tmpConfig);
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1');
  t.context.data = semverishSuper.pathToRange(
    '1', {attribute: 'attribute', inheritence: 'lazySemverist'}
  );
  t.deepEqual(
    t.context.data,
    '>=1.0.0 <2.0.0',
    'Tilde values should pass back the correct range'
  );
});
