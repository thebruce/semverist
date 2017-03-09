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

test('setSourceBadSource', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('entity');
  },
  'The semverish value must be able to be converted to a semver value.');
});

test('extractDifferentBadValue', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('entity.0');
  },
  'The semverish value must be able to be converted to a semver value.');
});

test('extractTooManySemverWithoutPrerelease', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('4.0.0.0');
  },
  'The semverish value must be able to be converted to a semver value.');
});


test('extractSemverPartsFromTooManyPeriods', (t) => {
  const semverishSuper = new SemverishSuper();
  t.context.data = semverishSuper.extractSemverishFromPath('4.1.');
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value with a trailing "." should not return that trailing ".".'
  );
});

test('extractSemverPartsFromLeadingPeriods', (t) => {
  t.throws(() => {
    const semverishSuper = new SemverishSuper();
    semverishSuper.extractSemverishFromPath('.1.');
  },
  'The semverish value must be able to be converted to a semver value.');
});


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
  'The semverish value must be able to be converted to a semver value.');
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

test('determineSemveristElementTypeAttribute', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      },
      fakeGroup: {
        members: [
          'punk'
        ]
      },
      testGroup2: {
        members: [
          'punk',
          'testItem'
        ]
      }
    }
  );
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('testItem');
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('determineSemveristElementTypeGroup', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      },
      fakeGroup: {
        members: [
          'punk'
        ]
      },
      testGroup2: {
        members: [
          'punk',
          'testItem'
        ]
      }
    }
  );
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('testGroup2');
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('determineSemveristElementTypeDefault', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      },
      fakeGroup: {
        members: [
          'punk'
        ]
      },
      testGroup2: {
        members: [
          'punk',
          'testItem'
        ]
      }
    }
  );
  semverishSuper.setDefaultName('default');
  t.context.data = semverishSuper.determineSemveristElementType('default');
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});
