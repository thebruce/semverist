import test from 'ava';

const semverishFactory = require('../../lib/semverish/semverish');

test('despecifySemver1to1', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverishArray('1');
    return semverishSuper.despecifySemver(1);
  });

  t.deepEqual(
    t.context.data,
   '1'
  );
});

test('despecifySemver2to1', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverishArray('1.0');
    return semverishSuper.despecifySemver(1);
  });

  t.deepEqual(
    t.context.data,
    '1'
  );
});

test('despecifySemver3to1', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverishArray('1.0.0');
    return semverishSuper.despecifySemver(1);
  });

  t.deepEqual(
    t.context.data,
    '1'
  );
});

test('despecifySemver4to1', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0-alpha.0');
    semverishSuper.setSemverishArray('1.0.0-alpha.0');
    return semverishSuper.despecifySemver(1);
  });

  t.deepEqual(
    t.context.data,
    '1'
  );
});

test('despecifySemver5to1OneInFiveNoOneHereGetsOutAlive', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0-alpha.0+542');
    semverishSuper.setSemverishArray('1.0.0-alpha.0+542');
    return semverishSuper.despecifySemver(1);
  });
  t.deepEqual(
    t.context.data,
    '1'
    );
});


test('despecifySemver3to3', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0-alpha');
    semverishSuper.setSemverishArray('1.0.0-alpha');
    return semverishSuper.despecifySemver(3);
  });
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('despecifySemver4to3', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0-alpha.0');
    semverishSuper.setSemverishArray('1.0.0-alpha.0');
    return semverishSuper.despecifySemver(3);
  });
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('despecifySemver3toUndefined', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverishArray('1.0.0');
    return semverishSuper.despecifySemver();
  });
  t.deepEqual(
    t.context.data,
    '1'
    );
});

test('despecifySemverishArrayEntity', async (t) => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setSemver('1.0.0');
    semverishSuper.setSemverishArray('1.0.entity');
    return semverishSuper.despecifySemver(2);
  });
  t.deepEqual(
    t.context.data,
    '1.0'
    );
});
