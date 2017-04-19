import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, './helpers/config', 'testThree');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars

const schoenberg = require('../lib/schoenberg');

const semverishObject = require('./helpers/semverishObject');
const processedComposition = require('./helpers/processedComposition');

test('Schoenberg.', async (t) => {
  t.context.data = await schoenberg(
    semverishObject,
    null,
    'semverImpliedOrchestraObject')
  .then((composer) => {
    composer.assembleManifest();
    return composer.getComposition();
  });
  t.deepEqual(
    t.context.data,
    processedComposition,
     'Should build out objects for all semver realizations.'
  );
});
