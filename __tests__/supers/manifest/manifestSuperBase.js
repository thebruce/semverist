const ManifestSuperBase = require('../../../lib/supers/manifest');

test('setConfigNameSpace', () => {
  const manifestSuperBase = new ManifestSuperBase({});
  manifestSuperBase.setConfigNameSpace('schemePunkForSchema');
  t.context.data = manifestSuperBase.getConfigNameSpace();
  expect(t.context.data).toEqual('schemePunkForSchema');
});

test('setConfig', () => {
  const manifestSuperBase = new ManifestSuperBase({
    happy: 'happy'
  });
  t.context.data = manifestSuperBase.getConfig();
  expect(t.context.data).toEqual({
      happy: 'happy'
    });
});
