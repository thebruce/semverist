import test from 'ava';

const SemveristSuperBase = require('../../../lib/supers/semveristSuperBase');

test('extractSemverGoodSemver', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0');
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'A valid semver should pass back the same value.'
    );
});

test('extractSemverMinorSemverOnly', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1');
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value should pass back valid semver range components'
    );
});

test('extractSemverAlpha', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0-alpha');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverAlphaDotVersion', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0-alpha.1');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.1',
    'Subleaves of prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverDeathStar', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0-deathstar.1');
  t.deepEqual(
    t.context.data,
    '4.1.0-deathstar.1',
    'Arbitrary yet not a star names are valid semver too and should come back intact.'
  );
});

test('extractWithAttribute', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'Semverist elements in pos[3] that do not have a pre-release shape should not be returned.'
  );
});

test('extractParitalWithAttribute', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.entity');
  t.deepEqual(
    t.context.data,
    '4.1',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
  );
});

test('extractMoreParitalWithAttribute', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.entity');
  t.deepEqual(
    t.context.data,
    '4',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
    );
});

test('extractAttributeWithAlpha', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0-alpha.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Partial semverish alpha strs with a semverist element at the end should exclude that element.'
  );
});

test('extractAttributeWithAlphaAndNumber', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.0-alpha.0.entity');
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.0',
    'Complete semver strings with a semverist element should exclude that element.'
  );
});

test('extractBadValue', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('entity');
  t.deepEqual(
    t.context.data,
    '',
    'An empty string value should result in an empty string.'
  );
});

test('extractDifferentBadValue', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('entity.0');
  t.deepEqual(
    t.context.data,
    '',
    'A non-semverish string should result in an empty string.'
  );
});

test('extractTooManySemverWithoutPrerelease', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.0.0.0');
  t.deepEqual(
    t.context.data,
    '',
    'A incompatible semverish-like string should result in an empty string.'
  );
});

test('extractSemverPartsFromTooManyPeriods', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('4.1.');
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value with a trailing "." should not return that trailing ".".'
  );
});

test('extractSemverPartsFromLeadingPeriods', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemverishFromPath('.1.');
  t.deepEqual(
    t.context.data,
    '',
    'A semverish value with a leading "." is not valid'
  );
});

test('setPreleasePatternWithArg', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setPreReleasePattern(/\d-[A-Z]*/g);
  t.context.data = semveristSuperBase.getPreReleasePattern();
  t.deepEqual(
    t.context.data,
    /\d-[A-Z]*/g,
    'Setting the preReleasePattern to a value should result in that value.'
  );
});

test('setPreleasePatternNoArg', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.getPreReleasePattern();
  t.deepEqual(
    t.context.data,
    /\d-[a-zA-Z]*/g,
    'The default pattern for the PreReleasePattern is "/\d-[a-zA-Z]*/g"'  //eslint-disable-line
  );
});

test('setSourceGoodSource', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSource({test: []});
  t.context.data = semveristSuperBase.getSource();
  t.deepEqual(
    t.context.data,
    {test: []},
    'Sources are objects, so an object should be a valid source.'
  );
});

test('setSourceBadSource', (t) => {
  t.throws(() => {
    const semveristSuperBase = new SemveristSuperBase();
    semveristSuperBase.setSource('test');
  },
  'Could not set source, it must be an object.');
});

test('extractSemveristElementFromPath', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath('4.0.0.entity');
  t.deepEqual(
    t.context.data,
    'entity',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('extractSemveristElementBadPath', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath('.0.0.entity');
  t.deepEqual(
    t.context.data,
    '',
    'A bad semverish value with a trailing semveristElement should return and empty string.'
  );
});

test('extractSemveristElementBadPath2', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath('1.0.0.');
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
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath('1.0.0.entity.property');
  t.deepEqual(
    t.context.data,
    'entity',
    String.prototype.concat(
      'A deep semverish path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath(
    '1.0.0-deathstar.entity.property'
  );
  t.deepEqual(
    t.context.data,
    'entity',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha0', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  t.context.data = semveristSuperBase.extractSemveristElementFromPath('1.0.0-deathstar.0.entity');
  t.deepEqual(
    t.context.data,
    'entity',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist element ',
      'should only return the element and not subpaths.'
    )
  );
});

test('setDefaultsName', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.getDefaultName();
  t.deepEqual(
    t.context.data,
    'default',
    'Set Default Name should be a clear pass through to default name value.'
  );
});

test('doesAttributeBelongToGroupTrue', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {
        members: [
          'testItem'
        ]
      }
    }
  );
  t.true(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup'),
    'Attributes who are members of a group should report that they belong to that group.'
  );
});


test('doesAttributeBelongToGroupFalse', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {
        members: [
          'junkItem'
        ]
      }
    }
  );
  t.false(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup'),
    'Attributes who are not members of a group should not report that they belong to that group.'
  );
});

test('doesAttributeBelongToGroupError', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
    {
      testGroup: {}
    }
  );
  t.throws(() => {
    semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup');
  },
  'testGroup group is not properly formed and has no members array');
});

test('getSemveristGroups', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
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
  t.context.data = semveristSuperBase.getSemveristAttributeGroups('testItem');
  t.deepEqual(
    t.context.data.sort(),
    [
      'testGroup',
      'testGroup2'
    ],
    'Groups that have the attribute being sought should be added to the return'
  );
});


test('determineSemveristElementTypeAttribute', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
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
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.determineSemveristElementType('testItem');
  t.deepEqual(
    t.context.data,
    'attribute',
    'Attributes should report back that they are attributes.'
  );
});

test('determineSemveristElementTypeGroup', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
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
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.determineSemveristElementType('testGroup2');
  t.deepEqual(
    t.context.data,
    'group',
    'Groups should report back that they are groups.'
  );
});

test('determineSemveristElementTypeDefault', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristGroups(
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
  semveristSuperBase.setDefaultName('default');
  t.context.data = semveristSuperBase.determineSemveristElementType('default');
  t.deepEqual(
    t.context.data,
    'default',
    'Defaults should report back that they are defaults.'
  );
});

test('getSemveristConfig', (t) => {
  const semveristSuperBase = new SemveristSuperBase();
  semveristSuperBase.setSemveristConfig(
    {
      semveristBehaviors: {}
    });
  t.context.data = semveristSuperBase.getSemveristConfig();
  t.deepEqual(
    Object.keys(t.context.data),
    ['semveristBehaviors'],
    'Get Config should be a pass through to set config.'
  );
});
