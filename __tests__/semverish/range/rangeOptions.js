const rangeFactory = require('../../../lib/semverish/range');

test('rangeGetOptions', async () => {
  t.context.data = await rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.getOptions();
  });
  expect(t.context.data).toEqual({
    attributeType: 'attribute',
    inheritence: 'semverImplied'
  });
});
