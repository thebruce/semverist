const semverishFactory = require('../../lib/semverish/semverish');

test('extractSemveristElementFromPath', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0.entity');
    return semverishSuper.extractSemveristElementFromPath('4.0.0.entity');
  });
  expect(t.context.data).toEqual('entity');
});

test('extractSemveristElementBadPath', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('.0.0.entity');
    semverishSuper.extractSemveristElementFromPath('.0.0.entity');
  })).toThrowError(String.prototype.concat(
    'The semverish value must be able to be converted to a semver value. ',
    'The semverish value must have atleast a major portion.'
  ));
});

test('extractSemveristElementBadPath2', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.');
    return semverishSuper.extractSemveristElementFromPath('1.0.0.');
  });
  expect(t.context.data).toEqual('');
});

test('extractSemveristElementDeepPath', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    return semverishSuper.extractSemveristElementFromPath('1.0.0.entity.property');
  });
  expect(t.context.data).toEqual('entity.property');
});

test('extractSemveristElementDeepPathAlpha', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0-deathstar.entity.property');
    return semverishSuper.extractSemveristElementFromPath(
      '1.0.0-deathstar.entity.property'
    );
  });
  expect(t.context.data).toEqual('entity.property');
});

test('extractSemveristElementDeepPathAlpha0', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0-deathstar.0.entity');
    return semverishSuper.extractSemveristElementFromPath('1.0.0-deathstar.0.entity');
  });
  expect(t.context.data).toEqual('entity');
});

test('extractSemveristElementNoSemverish', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemveristElementFromPath('1.0.0.entity');
  })).toThrowError('You must have a semverish value set before extracting an element');
});
