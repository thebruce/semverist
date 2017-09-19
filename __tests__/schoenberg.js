const schoenberg = require('../lib/schoenberg');
const nestedConfig = require('./helpers/nestedConfig.json');
const semverishObject = require('./helpers/semverishObject');
const processedComposition = require('./helpers/processedComposition');

test('Schoenberg.', async () => {
  t.context.data = await schoenberg(
    semverishObject,
    nestedConfig.semverist,
    'semverImpliedOrchestraObject')
  .then((composer) => {
    composer.assembleManifest();
    return composer.getComposition();
  });
  expect(t.context.data).toEqual(processedComposition);
});


test('Schoenberg throws', () => {  // eslint-disable-line
  expect(() => {
    schoenberg(
      semverishObject,
      null,
      'semverImpliedOrchestraObject'
    );
  }).toThrowError('Must have a valid semverist config to use schoenberg composer.');
});
