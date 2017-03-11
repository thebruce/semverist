import test from 'ava';

const SemverishSuper = require('../../lib/semverish/semverish');

test('nextHigherMajor3partSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.1');
  t.context.data = semverishSuper.getNextHigherMajor('0.0.1');
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('nextHigherMajor2partSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.0');
  t.context.data = semverishSuper.getNextHigherMajor('0.0');
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});

test('nextHigherMajor1partSemver', (t) => {
  const semverishSuper = new SemverishSuper();
  semverishSuper.setSemverParsed('0.0.0');
  t.context.data = semverishSuper.getNextHigherMajor('0');
  t.deepEqual(
    t.context.data,
    '1.0.0'
    );
});
