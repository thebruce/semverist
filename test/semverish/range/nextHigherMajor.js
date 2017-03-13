import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('nextHigherMajor3partSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.1');
    return range.getNextHigherMajor('0.0.1');
  });
  t.deepEqual(
    t.context.data,
    '1.0.0'
  );
});

test('nextHigherMajor2partSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.0');
    return range.getNextHigherMajor('0.0');
  });
  t.deepEqual(
    t.context.data,
    '1.0.0'
  );
});

test('nextHigherMajor1partSemver', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setSemverParsed('0.0.0');
    return range.getNextHigherMajor('0');
  });
  t.deepEqual(
    t.context.data,
    '1.0.0'
  );
});
