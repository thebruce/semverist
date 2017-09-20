'use strict';

const rangeFactory = require('../../../lib/semverish/range');

test('toCaretRange', () => {
  expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    range.setLowerBounds('0.1.0');
    return range.toCaretRange('0.1.0');
  })).resolves.toEqual('>=0.1.0 <0.2.0');
});
