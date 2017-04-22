import test from 'ava';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');
const semveristObject = require('../../helpers/semverishObject');
const path = require('path');
const processedLazySemverist = require('../../helpers/processedCompositionLazySemverist');

const semverishPath = path.join(
   __dirname,
  '../../../',
  'test/helpers/semverishObject'
);

test('Lazy semverist manifest.', async (t) => {
  t.context.data = await manifestFactory(
    'composer',
    'lazySemveristOrchestraObject',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all(
    [
      ManifestClass.createConverter(semveristObject),
      ManifestClass
    ]))
  .then((manifestIngredients) => {
    const ManifestClass = manifestIngredients[1];
    const converter = manifestIngredients[0][0];
    const converterClass = manifestIngredients[0][1];
    const schoenberg = new ManifestClass(converter, converterClass);
    schoenberg.init();
    schoenberg.assembleManifest();
    return schoenberg.getComposition();
  });
  t.deepEqual(
    t.context.data,
    processedLazySemverist,
     'Should build out objects for all semver realizations.'
  );
});

test('Lazy semverist directory manifest.', async (t) => {
  t.context.data = await manifestFactory(
    'composer',
    'lazySemveristOrchestraDirectory',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all(
    [
      ManifestClass.createConverter(semverishPath),
      ManifestClass
    ]))
  .then((manifestIngredients) => {
    const ManifestClass = manifestIngredients[1];
    const converter = manifestIngredients[0][0];
    const converterClass = manifestIngredients[0][1];
    const schoenberg = new ManifestClass(converter, converterClass);
    schoenberg.init();
    schoenberg.assembleManifest();
    return schoenberg.getComposition();
  });
  t.deepEqual(
    t.context.data,
    processedLazySemverist,
     'Should build out objects for all semver realizations.'
  );
});

