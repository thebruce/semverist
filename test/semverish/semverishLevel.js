import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('semverishLevelBuildWithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0+build124.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'build',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelBuildNoEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0+build124');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'build',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelPrerelease0WithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'prerelease',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelPrereleaseWithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'prerelease',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelPrereleaseNoEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'prerelease',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelPatchWithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'patch',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelPatchNoEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'patch',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelMinorWithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'minor',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelMinorNoEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'minor',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelMajorrWithEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'major',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('semverishLevelMajorNoEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  t.deepEqual(
    t.context.data,
    'major',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});
