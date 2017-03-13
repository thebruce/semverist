import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('extractSemverGoodSemver', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'A valid semver should pass back the same value.'
    );
});

test('extractSemverMinorSemverOnly', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1');
  });
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value should pass back valid semver range components'
    );
});

test('extractSemverAlpha', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverAlphaDotVersion', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.1');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.1',
    'Subleaves of prerelease tags are valid semver and should come back intact.'
  );
});

test('extractSemverDeathStar', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-deathstar.1');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-deathstar.1',
    'Arbitrary yet not a star names are valid semver too and should come back intact.'
  );
});

test('extractWithAttribute', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0.entity');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0',
    'Semverist elements in pos[3] that do not have a pre-release shape should not be returned.'
  );
});

test('extractParitalWithAttribute', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.entity');
  });
  t.deepEqual(
    t.context.data,
    '4.1',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
  );
});

test('extractMoreParitalWithAttribute', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.entity');
  });
  t.deepEqual(
    t.context.data,
    '4',
    'Partial semverish strs with a semverist element at the end should exclude that element.'
    );
});

test('extractAttributeWithAlpha', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setPreReleasePattern();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.entity');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha',
    'Partial semverish alpha strs with a semverist element at the end should exclude that element.'
  );
});

test('extractAttributeWithAlpha1', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setPreReleasePattern();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.0',
    'Partial semverish alpha strs with a semverist element at the end should exclude that element.'
  );
});

test('extractAttributeWithAlphaAndNumber', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0.entity');
  });
  t.deepEqual(
    t.context.data,
    '4.1.0-alpha.0',
    'Complete semver strings with a semverist element should exclude that element.'
  );
});

test('setSourceBadSourceLeading0', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity');
  }),
  'The semverish value must be able to be converted to a semver value.' +
  ' SemveristElement names can not have leading 0s.');
});

test('setSourceBadSourceLeading0DeepPath', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity.attribute');
  }),
  'The semverish value must be able to be converted to a semver value.' +
  ' SemveristElement names can not have leading 0s.');
});

test('setSourceBadSource', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('entity');
  }),
  'The semverish value must be able to be converted to a semver value.' +
  ' Unable to compare version string: entity');
});

test('extractDifferentBadValue', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('entity.0');
  }),
  'The semverish value must be able to be converted to a semver value. '
  + 'Unable to compare version string: entity.');
});

test('extractTooManySemverWithoutPrerelease', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('4.0.0.0');
  }),
  'The semverish value must be able to be converted to a semver '
  + 'value. Unable to compare version string: 4.0.0.0');
});


test('extractSemverPartsFromTooManyPeriods', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.');
  });
  t.deepEqual(
    t.context.data,
    '4.1',
    'A semverish value with a trailing "." ' +
    'should not return that trailing ".".'
  );
});

test('extractSemverPartsFromLeadingPeriods', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('.1.');
  }),
  'The semverish value must be able to be converted to a semver value. '
  + 'The semverish value must have atleast a major portion.');
});

test('Very bad semverish', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('1.1.entity......1');
  }),
  'The semverish value must be able to be converted to a semver value. ' +
  'There was a problem with your semverish path and the regex pattern used '
  + 'to identify your prereleases.');
});
