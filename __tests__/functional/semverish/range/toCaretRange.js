

const rangeFactory = require('../../../../lib/semverish/range');

describe('To Caret Range Tests', () => {
  test('toCaretRange Tests', () => {
    expect.assertions(1);
    return rangeFactory('semverist', 'range')
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setLowerBounds('0.1.0');
        return range.toCaretRange('0.1.0');
      })
      .then(obj => expect(obj).toEqual('>=0.1.0 <0.2.0'));
  });
});
