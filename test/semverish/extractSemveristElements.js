import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('extractSemveristElementFromPath', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('4.0.0.entity');
    return semverishSuper.extractSemveristElementFromPath('4.0.0.entity');
  });
  t.deepEqual(
    t.context.data,
    'entity',
    'A semverish value with a trailing semveristElement should return the element.'
  );
});

test('extractSemveristElementBadPath', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('.0.0.entity');
    semverishSuper.extractSemveristElementFromPath('.0.0.entity');
  }),
  String.prototype.concat(
    'The semverish value must be able to be converted to a semver value. ',
    'The semverish value must have atleast a major portion.'
  ));
});

test('extractSemveristElementBadPath2', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.');
    return semverishSuper.extractSemveristElementFromPath('1.0.0.');
  });
  t.deepEqual(
    t.context.data,
    '',
    String.prototype.concat(
      'A bad semverish value with a trailing period and no ',
      'semverist element should return an empty string.'
    )
  );
});

test('extractSemveristElementDeepPath', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0.entity.property');
    return semverishSuper.extractSemveristElementFromPath('1.0.0.entity.property');
  });
  t.deepEqual(
    t.context.data,
    'entity.property',
    String.prototype.concat(
      'A deep semverish path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0-deathstar.entity.property');
    return semverishSuper.extractSemveristElementFromPath(
      '1.0.0-deathstar.entity.property'
    );
  });
  t.deepEqual(
    t.context.data,
    'entity.property',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist ',
      'element should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementDeepPathAlpha0', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemverish('1.0.0-deathstar.0.entity');
    return semverishSuper.extractSemveristElementFromPath('1.0.0-deathstar.0.entity');
  });
  t.deepEqual(
    t.context.data,
    'entity',
    String.prototype.concat(
      'A deep semverish alpha path with a trailing semverist element ',
      'should only return the element and not subpaths.'
    )
  );
});

test('extractSemveristElementNoSemverish', async (t) => {
  await t.throws(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemveristElementFromPath('1.0.0.entity');
  }),
  'You must have a semverish value set before extracting an element');
});
