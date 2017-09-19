const rangeFactory = require('../../../lib/semverish/range');

test('terminalBounds', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('0.0.9');
    return rangeClass.getTerminalBounds();
  });
  expect(t.context.data).toEqual('0.0.9');
});

test('terminalBoundsRange', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('<0.0.9');
    return rangeClass.getTerminalBounds();
  });
  expect(t.context.data).toEqual('<0.0.9');
});


test('terminalBoundsInvalidRange', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.setLowerBounds('0.0.1');
    rangeClass.setTerminalBounds('1.R');
  })).toThrow();
});
