const rangeFactory = require('../../../lib/semverish/range');

test('configNoSemveristBehaviors', async () => {
  await expect(rangeFactory('semverist', 'range')
  .then((RangeClass) => {
    const range = new RangeClass();
    const badConfig = {
      semveristBehaviors: {
        inheritence: 'nothing'
      }
    };
    range.init(badConfig);
  })).toThrowError('The options inheritence attribute must one of the following'
  + ' values: semverImplied, null, or lazySemverist');
});
