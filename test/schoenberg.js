import test from 'ava';

const schoenberg = require('../lib/schoenberg');
const nestedConfig = require('./helpers/nestedConfig.json');
const semverishObject = require('./helpers/semverishObject');
const processedComposition = require('./helpers/processedComposition');

test('Schoenberg.', async (t) => {
  t.context.data = await schoenberg(
    semverishObject,
    nestedConfig.semverist,
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


test('Schoenberg throws', t => {  // eslint-disable-line
  t.throws(() => {
    schoenberg(
      semverishObject,
      null,
      'semverImpliedOrchestraObject'
    );
  },
  'Must have a valid semverist config to use schoenberg composer.');
});
