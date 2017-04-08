import test from 'ava';

const rangeFactory = require('../../../lib/semverish/range');

test('configNoSemveristBehaviors', async (t) => {
  await t.throws(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    const badConfig = {
      semveristBehaviors: {
        inheritence: 'nothing'
      }
    };
    range.init(badConfig);
  }),
  'The options inheritence attribute must one of the following'
  + ' values: semverImplied, null, or lazySemverist'
  );
});
