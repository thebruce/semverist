const rangeFactory = require('../../../../lib/semverish/range');

test('rangeGetOptions', () => {
  expect.assertions(1);
  return rangeFactory('semverist', 'range')
    .then(RangeClass => {
      const rangeClass = new RangeClass();
      rangeClass.init();
      rangeClass.setSemveristElementType('entity');
      rangeClass.setOptions();
      return rangeClass.getOptions();
    })
    .then(obj =>
      expect(obj).toEqual({
        attributeType: 'attribute',
        inheritence: 'semverImplied',
      })
    );
});
