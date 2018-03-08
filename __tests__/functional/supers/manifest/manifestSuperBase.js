

const ManifestSuperBase = require('../../../../lib/supers/manifest');

test('setConfigNameSpace', () => {
  const manifestSuperBase = new ManifestSuperBase({});
  manifestSuperBase.setConfigNameSpace('schemePunkForSchema');
  expect.assertions(1);
  return expect(manifestSuperBase.getConfigNameSpace()).toEqual('schemePunkForSchema');
});

test('setConfig', () => {
  expect.assertions(1);
  const manifestSuperBase = new ManifestSuperBase({
    happy: 'happy',
  });
  return expect(manifestSuperBase.getConfig())
    .toEqual({
      happy: 'happy',
    });
});
