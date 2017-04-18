import test from 'ava';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');

test('manifestDefaultClasses', async (t) => {
  t.context.data = await manifestFactory('composer', 'useLazySemverist', nestedConfig.semverist)
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.setManifestCapabilities();
    return schoenberg.getManifestCapabilities();
  });
  t.deepEqual(
    t.context.data.sort(),
    [
      'attribute',
      'default',
      'group'
    ],
    'Named plugins should get config based mixins as well as their own.'
  );
});
