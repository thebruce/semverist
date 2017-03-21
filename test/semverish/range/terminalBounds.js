import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('terminalBounds', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setUpperBounds('<1.0.0');
    rangeClass.setTerminalBounds('0.0.9');
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
    rangeClass.setUpperBounds('<1.0.0');
    rangeClass.setTerminalBounds('1.R');
  }));
});

test('terminalBoundsGreaterThanUpper', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setUpperBounds('<1.0.0');
    rangeClass.setTerminalBounds('1.1.0');
    return rangeClass.getTerminalBounds();
  });
  t.deepEqual(
    t.context.data,
    undefined,
    'Terminal bounds should not be greater than upperbounds and it is.'
  );
});
