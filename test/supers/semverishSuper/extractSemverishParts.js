import test from 'ava';

const SemverishSuper = require('../../../lib/supers/semverishSuper');

test('extractSemverGoodSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0');
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'A valid semver should pass back the same value.'
    );
});

test('extractSemverMinorSemverOnly', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1');
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value should pass back valid semver range components'
    );
});

test('extractSemverAlpha', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-alpha');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverAlphaDotVersion', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-alpha.1');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.1',
    'Subleaves of prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverDeathStar', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-deathstar.1');
  t.deepEqual(
    t.context.data,
    '4.1.0-deathstar.1',
    'Arbitrary yet not a star names are valid semver too and should come back intact.'
  );
});

test('extractWithAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'Semverist elements in pos[3] that do not have a pre-release shape should not be returned.'
  );
});

test('extractParitalWithAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.entity');
  t.deepEqual(
    t.context.data,
    '4.1',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
  );
});

test('extractMoreParitalWithAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.entity');
  t.deepEqual(
    t.context.data,
    '4',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
    );
});

test('extractAttributeWithAlpha', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setPreReleasePattern();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-alpha.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Partial semverish alpha strs with a semverist element at the end should exclude that element.'
  );
});

test('extractAttributeWithAlpha1', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setPreReleasePattern();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-alpha.0');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.0',
    'Partial semverish alpha strs with a semverist element at the end should exclude that element.'
  );
});

test('extractAttributeWithAlphaAndNumber', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.0-alpha.0.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.0',
    'Complete semver strings with a semverist element should exclude that element.'
  );
});

test('setSourceBadSourceLeading0', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity');
  },
  'The semverish value must be able to be converted to a semver value. '
  + 'SemveristElement names can not have leading 0s.');
});

test('setSourceBadSourceLeading0DeepPath', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity.attribute');
  },
  'The semverish value must be able to be converted to a semver value.' +
  ' SemveristElement names can not have leading 0s.');
});

test('setSourceBadSource', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('entity');
  },
  'The semverish value must be able to be converted to a semver value.' +
  ' Unable to compare version string: entity');
});

test('extractDifferentBadValue', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('entity.0');
  },
  'The semverish value must be able to be converted to a semver value. '
  + 'Unable to compare version string: entity.');
});

test('extractTooManySemverWithoutPrerelease', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('4.0.0.0');
  },
  'The semverish value must be able to be converted to a semver '
  + 'value. Unable to compare version string: 4.0.0.0');
});


test('extractSemverPartsFromTooManyPeriods', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.');
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value with a trailing "." ' +
    'should not return that trailing ".".'
  );
});

test('extractSemverPartsFromLeadingPeriods', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('.1.');
  },
  'The semverish value must be able to be converted to a semver value. '
  + 'The semverish value must have atleast a major portion.');
});

test('Very bad semverish', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('1.1.entity......1');
  },
  'The semverish value must be able to be converted to a semver value. ' +
  'There was a problem with your semverish path and the regex pattern used '
  + 'to identify your prereleases.');
});
