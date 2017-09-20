'use strict';

const rangeFactory = require('../../../lib/semverish/range');

test('rangeGetOptions', () => {
  expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const rangeClass = new RangeClass();
    rangeClass.init();
    rangeClass.setSemveristElementType('entity');
    rangeClass.setOptions();
    return rangeClass.getOptions();
  }))
  .resolves.toEqual({
    attributeType: 'attribute',
    inheritence: 'semverImplied'
  });
});
