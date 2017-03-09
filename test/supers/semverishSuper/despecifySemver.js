import test from 'ava';

const SemverishSuper = require('../../../lib/supers/semverishSuper');

test('despecifySemver1to1', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
   '1'
    );
});

test('despecifySemver2to1', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1.0');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
    '1'
    );
});

test('despecifySemver3to1', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1.0.0');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
    '1'
    );
});

test('despecifySemver4to1', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0-alpha.0');
  semverishSuper.setSemverishArray('1.0.0-alpha.0');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
    '1'
    );
});

test('despecifySemver5to1OneInFiveNoOneHereGetsOutAlive', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0-alpha.0+542');
  semverishSuper.setSemverishArray('1.0.0-alpha.0+542');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
    '1'
    );
});


test('despecifySemver3to3', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0-alpha');
  semverishSuper.setSemverishArray('1.0.0-alpha');
  t.context.data = semverishSuper.despecifySemver(3);
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('despecifySemver4to3', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0-alpha.0');
  semverishSuper.setSemverishArray('1.0.0-alpha.0');
  t.context.data = semverishSuper.despecifySemver(3);
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('despecifySemver3toUndefined', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('1.0.0');
  semverishSuper.setSemverishArray('1.0.0');
  t.context.data = semverishSuper.despecifySemver(1);
  t.deepEqual(
    t.context.data,
    '1'
    );
});
