import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('toCaretRange', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setLowerBounds('0.1.0');
    return range.toCaretRange('0.1.0');
  });
  t.deepEqual(
    t.context.data,
    '>=0.1.0 <0.2.0'
    );
});
