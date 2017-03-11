import test from 'ava';

const SemverishSuper = require('../../lib/semverish/semverish');

test('setOriginalSemverishValue', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setOriginalSemverishValue('1.0');
  t.context.data = semverishSuper.getOriginalSemverishValue();
  t.deepEqual(
    t.context.data,
    '1.0',
    'Semverish get should return from semverish set.'
    );
});

test('setSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemver('1.0.0');
  t.context.data = semverishSuper.getSemver();
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMinorLevel', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.episode');
  semverishSuper.setSemveristElement('1.0.episode');
  t.context.data = semverishSuper.getSemveristElement();
  t.deepEqual(
    t.context.data,
    'episode',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMajorLevel', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.entity');
  semverishSuper.setSemveristElement('1.entity');
  t.context.data = semverishSuper.getSemveristElement();
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementPatchLevel', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0.entity');
  semverishSuper.setSemveristElement('1.0.0.entity');
  t.context.data = semverishSuper.getSemveristElement();
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMajorLevelDeepProperty', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0.entity.property');
  semverishSuper.setSemveristElement('1.0.0.episode.property');
  t.context.data = semverishSuper.getSemveristElement();
  t.deepEqual(
    t.context.data,
    'episode',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMajorLevelGetRaw', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0.entity.property');
  semverishSuper.setSemveristElement('1.0.0.episode.property');
  t.context.data = semverishSuper.getRawSemveristElement();
  t.deepEqual(
    t.context.data,
    [
      'episode',
      'property'
    ],
    'Semverish get should return from semverish set.'
    );
});

test('setIsPrereleasePath', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemver('1.0.0');
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setIsPreReleasePath();
  t.context.data = semverishSuper.getIsPreReleasePath();
  t.deepEqual(
    t.context.data,
    false,
    'A non-prerelease path should report false.'
    );
});

test('setIsPrereleasePathNoParsed', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemver('1.0.0');
  semverishSuper.setIsPreReleasePath();
  t.context.data = semverishSuper.getIsPreReleasePath();
  t.deepEqual(
    t.context.data,
    false,
    'A non-prerelease path should report false.'
    );
});

test('setIsPrereleaseNoParsedNoSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  t.throws(() => {
    semverishSuper.setIsPreReleasePath();
  },
  'There is no semver value to check for prerelease.');
});

test('init', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.init('4.1.entity');
  t.context.data = semverishSuper.getSemverishArray();
  t.deepEqual(
    t.context.data,
    [
      '4',
      '1',
      'entity'
    ],
    'A semverish value with a trailing "." should not return that trailing ".".'
  );
});

test('init full semver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.init('4.1.0');
  t.context.data = semverishSuper.getSemverishArray();
  t.deepEqual(
    t.context.data,
    [
      '4',
      '1',
      '0'
    ],
    'A semverish value with a trailing "." should not return that trailing ".".'
  );
});
