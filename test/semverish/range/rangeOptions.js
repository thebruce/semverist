import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('rangeGetOptions', async (t) => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.getOptions();
  });
  t.deepEqual(
    t.context.data,
    {
      attributeType: 'attribute',
      inheritence: 'semverImplied'
    },
    'Semverish get should return from semverish set.'
  );
});
