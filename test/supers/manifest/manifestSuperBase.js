import test from 'ava';

const ManifestSuperBase = require('../../../lib/supers/manifest');

const lazySemverConfigs = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: false
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'lastIn',
    preReleasePattern: /\d-[a-zA-Z]*/g
  },
  groups: {},
  prereleaseOrdering: {}
};

test('setConfigNameSpace', (t) => {
  const manifestSuperBase = new ManifestSuperBase();
  manifestSuperBase.setConfigNameSpace('schemePunkForSchema');
  t.context.data = manifestSuperBase.getConfigNameSpace();
  t.deepEqual(
    t.context.data,
    'schemePunkForSchema',
    'The Config namespace should return a match for what it was set.'
  );
});

test('setConfig', (t) => {
  const manifestSuperBase = new ManifestSuperBase();
  manifestSuperBase.setConfig({
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

test('init', (t) => {
  const manifestSuperBase = new ManifestSuperBase();
  manifestSuperBase.init(lazySemverConfigs);
  t.context.data = manifestSuperBase.getConfig();
  t.deepEqual(
    t.context.data,
    lazySemverConfigs,
    'Config should return a match for what it was set.'
  );
});
