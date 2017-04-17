import test from 'ava';

const path = require('path');

const manifestFactory = require('../../lib/manifest/manifest');
const nestedConfig = require('../helpers/nestedConfig.json');
const semveristObject = require('../helpers/semverishObject');
const digestedHelper = require('../helpers/semverImpliedProcessed.json');

const semverishPath = path.join(
   __dirname,
  '../../',
  'test/helpers/semverishObject'
);

test('manifestNoPluginName still has capabilities', async (t) => {
  t.context.data = await manifestFactory(null, 'useLazySemverist', nestedConfig.semverist)
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
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName No Defaults', async (t) => {
  t.context.data = await manifestFactory(null, 'semverImpliedNoDefaults', nestedConfig.semverist)
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.setManifestCapabilities();
    return schoenberg.getManifestCapabilities();
  });
  t.deepEqual(
    t.context.data.sort(),
    [
      'attribute',
      'group'
    ],
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName No Groups', async (t) => {
  t.context.data = await manifestFactory(null, 'semverImpliedNoGroups', nestedConfig.semverist)
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.setManifestCapabilities();
    return schoenberg.getManifestCapabilities();
  });
  t.deepEqual(
    t.context.data.sort(),
    [
      'attribute',
      'default'
    ],
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName No Defaults No Groups', async (t) => {
  t.context.data = await manifestFactory(
    null,
    'semverImpliedNoDefaultsNoGroups',
    nestedConfig.semverist
  )
  .then((ManifestClass) => {
    const schoenberg = new ManifestClass();
    schoenberg.setManifestCapabilities();
    return schoenberg.getManifestCapabilities();
  });
  t.deepEqual(
    t.context.data.sort(),
    [
      'attribute'
    ],
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName default config still has capabilities', async (t) => {
  t.context.data = await manifestFactory()
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
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('Converter static object.', async (t) => {
  t.context.data = await manifestFactory(
    null,
    'semverImpliedOrchestraObject',
    nestedConfig.semverist
  )
  .then(ManifestClass => ManifestClass.createConverter(semveristObject));
  t.deepEqual(
    t.context.data,
    digestedHelper,
     'Static converter creation creates a converter object as with stand alone converter..'
  );
});

test('Converter static object to manifest converter.', async (t) => {
  t.context.data = await manifestFactory(
    null,
    'semverImpliedOrchestraObject',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all(
    [
      ManifestClass.createConverter(semveristObject),
      ManifestClass
    ]))
  .then((manifestIngredients) => {
    const schoenberg = new manifestIngredients[1](manifestIngredients[0]);
    return schoenberg.getConverter();
  });
  t.deepEqual(
    t.context.data,
    digestedHelper,
     'Static converter creation creates a converter object as with stand alone converter..'
  );
});

test('Directory Converter static object to manifest converter.', async (t) => {
  t.context.data = await manifestFactory(
    null,
    'semverImpliedOrchestraDirectory',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all([ManifestClass.createConverter(semverishPath), ManifestClass]))
  .then((manifestIngredients) => {
    const schoenberg = new manifestIngredients[1](manifestIngredients[0]);
    return schoenberg.getConverter();
  });
  t.deepEqual(
    t.context.data,
    digestedHelper,
     'Static converter creation creates a converter object as with stand alone converter..'
  );
});

test('Manifest component Defaults.', async (t) => {
  t.context.data = await manifestFactory(
    null,
    'semverImpliedOrchestraObject',
    nestedConfig.semverist
  )
  .then(ManifestClass => Promise.all(
    [
      ManifestClass.createConverter(semveristObject),
      ManifestClass
    ]))
  .then((manifestIngredients) => {
    const schoenberg = new manifestIngredients[1](manifestIngredients[0]);
    schoenberg.init();
    return schoenberg.getManifestComponents();
  });
  t.not(
    t.context.data.clarinet['1.1.1'].components.indexOf('1.orchestraDefault'),
   -1,
     'Static converter creation creates a converter object as with stand alone converter..'
  );
});
