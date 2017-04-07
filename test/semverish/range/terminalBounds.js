import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('terminalBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('0.0.9');
    return rangeClass.getTerminalBounds();
  });
  t.deepEqual(
    t.context.data,
    '0.0.9',
    'Semverish get should return from semverish set.'
  );
});

test('terminalBoundsRange', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('<0.0.9');
    return rangeClass.getTerminalBounds();
  });
  t.deepEqual(
    t.context.data,
    '<0.0.9',
    'Semverish get should return from semverish set.'
  );
});


test('terminalBoundsInvalidRange', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('1.R');
  }));
});
