const semverishFactory = require('../../lib/semverish/semverish');

test('semverishLevelBuildWithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0+build124.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('build');
});

test('semverishLevelBuildNoEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0+build124');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('build');
});

test('semverishLevelPrerelease0WithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('prerelease');
});

test('semverishLevelPrereleaseWithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('prerelease');
});

test('semverishLevelPrereleaseNoEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0-alpha');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('prerelease');
});

test('semverishLevelPatchWithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('patch');
});

test('semverishLevelPatchNoEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('patch');
});

test('semverishLevelMinorWithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('minor');
});

test('semverishLevelMinorNoEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('minor');
});

test('semverishLevelMajorrWithEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.entity');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('major');
});

test('semverishLevelMajorNoEntity', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4');
    semverishSuper.setSemverishLevel();
    return semverishSuper.getSemverishLevel();
  });
  expect(t.context.data).toEqual('major');
});
