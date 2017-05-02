import test from 'ava';

const manifestFactory = require('../../../lib/manifest/manifest');
const nestedConfig = require('../../helpers/nestedConfig.json');
const path = require('path');
const fs = require('fs-extra');
const temp = require('temp').track();
const _ = require('lodash');

const semverishPath = path.join(
   __dirname,
  '../../../',
  'test/helpers/altSemverishObject'
);

test.after.always('cleanup', t => { // eslint-disable-line
  temp.cleanupSync();
});

test('write composition.', async (t) => {
  const tmpConfig = _.cloneDeep(nestedConfig.semverist);

  const mkDirAsPromise = (filePath) => // eslint-disable-line
    new Promise((resolve, reject) =>
      temp.mkdir(filePath, (err, data) => // eslint-disable-line
      err ? reject(err) : resolve(data)));

  t.context.data = await mkDirAsPromise('semverist')
  .then((dirPath) => {
    _.set(tmpConfig, 'semverImpliedAvengersExtant.composer.destination', dirPath);
    return manifestFactory(
      'composer',
      'semverImpliedAvengersExtant',
      tmpConfig
    );
  })
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
    schoenberg.writeComposition();
    return fs.readFileSync(
      `${schoenberg.getCompositionDestination()}/1/0/0/antMan.txt`,
      {encoding: 'utf-8'}
    );
  });
  t.deepEqual(
    t.context.data,
    'antMan',
    'Should build out objects for all semver realizations.'
  );
});
