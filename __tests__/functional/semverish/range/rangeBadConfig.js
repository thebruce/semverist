'use strict';

const rangeFactory = require('../../../../lib/semverish/range');

test('range test with bad config.', () => {
  expect.assertions(1);
  return rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    const badConfig = {
      semveristBehaviors: {
        inheritence: 'nothing'
      }
    };
    range.init(badConfig);
  })
  .catch((e) => {
    expect(e.message).toEqual(
      'The options inheritence attribute must one of the following values: semverImplied, null, or lazySemverist'
    );
  });
});
