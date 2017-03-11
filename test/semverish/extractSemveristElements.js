import test from 'ava';

const SemverishSuper = require('../../lib/semverish/semverish');

test('extractSemveristElementFromPath', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('4.0.0.entity');
  t.context.data = semverishSuper.extractSemveristElementFromPath('4.0.0.entity');
  t.deepEqual(
    t.context.data,
    'entity',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('extractSemveristElementBadPath', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.setSemverish('.0.0.entity');
    semverishSuper.extractSemveristElementFromPath('.0.0.entity');
  },
  String.prototype.concat(
    'The semverish value must be able to be converted to a semver value. ',
    'The semverish value must have atleast a major portion.'
  ));
});

test('extractSemveristElementBadPath2', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0.');
  t.context.data = semverishSuper.extractSemveristElementFromPath('1.0.0.');
  t.deepEqual(
    t.context.data,
    '',
    String.prototype.concat(
      'A bad semverish value with a trailing period and no ',
      'semverist element should return an empty string.'
    )
  );
});

test('extractSemveristElementDeepPath', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0.entity.property');
  t.context.data = semverishSuper.extractSemveristElementFromPath('1.0.0.entity.property');
  t.deepEqual(
    t.context.data,
    'entity.property',
    String.prototype.concat(
      'A deep semverish path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0-deathstar.entity.property');
  t.context.data = semverishSuper.extractSemveristElementFromPath(
    '1.0.0-deathstar.entity.property'
  );
  t.deepEqual(
    t.context.data,
    'entity.property',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha0', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverish('1.0.0-deathstar.0.entity');
  t.context.data = semverishSuper.extractSemveristElementFromPath('1.0.0-deathstar.0.entity');
  t.deepEqual(
    t.context.data,
    'entity',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist element ',
      'should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementNoSemverish', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemveristElementFromPath('1.0.0.entity');
  },
  'You must have a semverish value set before extracting an element');
});
