import test from 'ava';

const manifestFactory = require('../../lib/manifest/manifest');
const nestedConfig = require('../helpers/nestedConfig.json');

test('manifestNoPluginName still has capabilities', async (t) => {
  t.context.data = await manifestFactory(null, 'useLazySemverist', nestedConfig.semverist)
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
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName No Defaults', async (t) => {
  t.context.data = await manifestFactory(null, 'semverImpliedNoDefaults', nestedConfig.semverist)
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
      'groups'
    ],
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName No Groups', async (t) => {
  t.context.data = await manifestFactory(null, 'semverImpliedNoGroups', nestedConfig.semverist)
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
    schoenberg.init();
    schoenberg.setManifestComponents();
    return schoenberg.getManifestComponents();
  });
  t.deepEqual(
    Object.keys(t.context.data).sort(),
    [
      'attributes'
    ],
     'Manifest config based mixins are registered even with no named plugin.'
  );
});

test('manifestNoPluginName default config still has capabilities', async (t) => {
  t.context.data = await manifestFactory()
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
     'Manifest config based mixins are registered even with no named plugin.'
  );
});