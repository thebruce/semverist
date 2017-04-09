import test from 'ava';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');

test('manifestDefaultClasses', async (t) => {
  t.context.data = await manifestFactory('composer', 'useLazySemverist', nestedConfig.semverist)
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.init();
    schoenberg.setManifestComponents();
    return schoenberg.getManifestComponents();
  });
  t.deepEqual(
    Object.keys(t.context.data).sort(),
    [
      'attributes',
      'default',
      'groups'
    ],
    'Named plugins should get config based mixins as well as their own.'
  );
});
