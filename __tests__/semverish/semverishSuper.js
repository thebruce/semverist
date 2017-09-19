const semverishFactory = require('../../lib/semverish/semverish');

test('setOriginalSemverishValue', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setOriginalSemverishValue('1.0');
    return semverishSuper.getOriginalSemverishValue();
  });
  expect(t.context.data).toEqual('1.0');
});

test('setSemver', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    return semverishSuper.getSemver();
  });
  expect(t.context.data).toEqual('1.0.0');
});

test('setSemverishElementMinorLevel', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.episode');
    semverishSuper.setSemveristElement('1.0.episode');
    return semverishSuper.getSemveristElement();
  });
  expect(t.context.data).toEqual('episode');
});

test('setSemverishElementMajorLevel', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.entity');
    semverishSuper.setSemveristElement('1.entity');
    return semverishSuper.getSemveristElement();
  });
  expect(t.context.data).toEqual('entity');
});

test('setSemverishElementPatchLevel', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity');
    semverishSuper.setSemveristElement('1.0.0.entity');
    return semverishSuper.getSemveristElement();
  });
  expect(t.context.data).toEqual('entity');
});

test('setSemverishElementMajorLevelDeepProperty', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    semverishSuper.setSemveristElement('1.0.0.episode.property');
    return semverishSuper.getSemveristElement();
  });
  expect(t.context.data).toEqual('episode');
});

test('setSemverishElementMajorLevelGetRaw', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    semverishSuper.setSemveristElement('1.0.0.episode.property');
    return semverishSuper.getRawSemveristElement();
  });
  expect(t.context.data).toEqual([
    'episode',
    'property'
  ]);
});

test('setIsPrereleasePath', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverParsed('1.0.0');
    semverishSuper.setIsPreReleasePath();
    return semverishSuper.getIsPreReleasePath();
  });
  expect(t.context.data).toEqual(false);
});

test('setIsPrereleasePathNoParsed', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setIsPreReleasePath();
    return semverishSuper.getIsPreReleasePath();
  });
  expect(t.context.data).toEqual(false);
});

test('setIsPrereleaseNoParsedNoSemver', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setIsPreReleasePath();
  })).toThrowError('There is no semver value to check for prerelease.');
});

test('init', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.init('4.1.entity');
    return semverishSuper.getSemverishArray();
  });
  expect(t.context.data).toEqual([
    '4',
    '1',
    'entity'
  ]);
});

test('init full semver', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.init('4.1.0');
    return semverishSuper.getSemverishArray();
  });
  expect(t.context.data).toEqual([
    '4',
    '1',
    '0'
  ]);
});

test('No plugin', async () => {
  t.context.data = await semverishFactory('semverist')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.despecifySemver ? 'exists' : 'notExist';
  });
  expect(t.context.data).toEqual('notExist');
});
