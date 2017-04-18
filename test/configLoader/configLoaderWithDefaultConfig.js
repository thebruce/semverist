import test from 'ava';

const path = require('path');
// Need to get clean versions to test with env variables.
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// set up test config dirs.
process.env.NODE_CONFIG_DIR = path.join(__dirname, '../helpers/config', 'testOne');
// And require here so that later requires will use this cached version.
const config = require('config'); // eslint-disable-line no-unused-vars
const configLoader = require('../../lib/configLoader');

test.serial('init with overrides lazy Semverist', (t) => {
  t.context.data = configLoader('useLazySemverist');
  t.deepEqual(
    t.context.data.semveristBehaviors.inheritence,
    'lazySemverist',
    'Overridden config should be set by providing new config to init.'
  );
});
