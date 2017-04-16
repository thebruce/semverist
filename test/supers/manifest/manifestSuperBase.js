import test from 'ava';

const ManifestSuperBase = require('../../../lib/supers/manifest');

test('setConfigNameSpace', (t) => {
  const manifestSuperBase = new ManifestSuperBase({});
  manifestSuperBase.setConfigNameSpace('schemePunkForSchema');
  t.context.data = manifestSuperBase.getConfigNameSpace();
  t.deepEqual(
    t.context.data,
    'schemePunkForSchema',
    'The Config namespace should return a match for what it was set.'
  );
});

test('setConfig', (t) => {
  const manifestSuperBase = new ManifestSuperBase({
    happy: 'happy'
  });
  t.context.data = manifestSuperBase.getConfig();
  t.deepEqual(
    t.context.data, {
      happy: 'happy'
    },
    'Config should return a match for what it was set.'
  );
});
