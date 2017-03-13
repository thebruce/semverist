import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('setOriginalSemverishValue', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setOriginalSemverishValue('1.0');
    return semverishSuper.getOriginalSemverishValue();
  });
  t.deepEqual(
    t.context.data,
    '1.0',
    'Semverish get should return from semverish set.'
  );
});

test('setSemver', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    return semverishSuper.getSemver();
  });
  t.deepEqual(
    t.context.data,
    '1.0.0',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMinorLevel', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.episode');
    semverishSuper.setSemveristElement('1.0.episode');
    return semverishSuper.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'episode',
    'Semverish get should return from semverish set.'
  );
});

test('setSemverishElementMajorLevel', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.entity');
    semverishSuper.setSemveristElement('1.entity');
    return semverishSuper.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
  );
});

test('setSemverishElementPatchLevel', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity');
    semverishSuper.setSemveristElement('1.0.0.entity');
    return semverishSuper.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'entity',
    'Semverish get should return from semverish set.'
  );
});

test('setSemverishElementMajorLevelDeepProperty', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    semverishSuper.setSemveristElement('1.0.0.episode.property');
    return semverishSuper.getSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    'episode',
    'Semverish get should return from semverish set.'
    );
});

test('setSemverishElementMajorLevelGetRaw', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    semverishSuper.setSemveristElement('1.0.0.episode.property');
    return semverishSuper.getRawSemveristElement();
  });
  t.deepEqual(
    t.context.data,
    [
      'episode',
      'property'
    ],
    'Semverish get should return from semverish set.'
    );
});

test('setIsPrereleasePath', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverParsed('1.0.0');
    semverishSuper.setIsPreReleasePath();
    return semverishSuper.getIsPreReleasePath();
  });
  t.deepEqual(
    t.context.data,
    false,
    'A non-prerelease path should report false.'
  );
});

test('setIsPrereleasePathNoParsed', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setIsPreReleasePath();
    return semverishSuper.getIsPreReleasePath();
  });
  t.deepEqual(
    t.context.data,
    false,
    'A non-prerelease path should report false.'
  );
});

test('setIsPrereleaseNoParsedNoSemver', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setIsPreReleasePath();
  }),
  'There is no semver value to check for prerelease.');
});

test('init', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.init('4.1.entity');
    return semverishSuper.getSemverishArray();
  });
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

test('init full semver', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.init('4.1.0');
    return semverishSuper.getSemverishArray();
  });
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
